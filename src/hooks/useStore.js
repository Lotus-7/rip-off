import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayKey, isYesterday } from '../lib/dateUtils';

function makeId() {
  return 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

function makeSubId() {
  return 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

const useStore = create(
  persist(
    (set, get) => ({
      profile: { totalXP: 0, createdAt: null },
      streak: { current: 0, longest: 0, lastCheckInDate: null, checkInDates: [] },
      notesByDate: {},
      activeFilter: 'all',
      currentView: 'today',

      // --- Filter / View ---
      setActiveFilter: (cat) => set({ activeFilter: cat }),
      setCurrentView: (view) => set({ currentView: view }),

      // --- Note CRUD ---
      addNote: (note) => {
        const key = note.dateKey || todayKey();
        const newNote = {
          id: makeId(),
          title: note.title,
          description: note.description || '',
          category: note.category || 'body',
          color: note.color || 'yellow',
          xp: note.xp || 30,
          startTime: note.startTime || '',
          endTime: note.endTime || '',
          rotation: (Math.random() * 3 - 1.5),
          completed: false,
          completedAt: null,
          subTasks: (note.subTasks || []).map(text => ({
            id: makeSubId(),
            text,
            done: false,
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => {
          const dayNotes = state.notesByDate[key] || [];
          return {
            notesByDate: {
              ...state.notesByDate,
              [key]: [...dayNotes, newNote],
            },
          };
        });
      },

      updateNote: (dateKey, noteId, updates) => {
        set((state) => {
          const dayNotes = state.notesByDate[dateKey] || [];
          return {
            notesByDate: {
              ...state.notesByDate,
              [dateKey]: dayNotes.map(n =>
                n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
              ),
            },
          };
        });
      },

      deleteNote: (dateKey, noteId) => {
        set((state) => {
          const dayNotes = state.notesByDate[dateKey] || [];
          return {
            notesByDate: {
              ...state.notesByDate,
              [dateKey]: dayNotes.filter(n => n.id !== noteId),
            },
          };
        });
      },

      // --- Sub-tasks ---
      toggleSubTask: (dateKey, noteId, subTaskId) => {
        set((state) => {
          const dayNotes = state.notesByDate[dateKey] || [];
          return {
            notesByDate: {
              ...state.notesByDate,
              [dateKey]: dayNotes.map(n =>
                n.id === noteId
                  ? {
                      ...n,
                      subTasks: n.subTasks.map(s =>
                        s.id === subTaskId ? { ...s, done: !s.done } : s
                      ),
                    }
                  : n
              ),
            },
          };
        });
      },

      // --- Complete (tear off) ---
      completeNote: (dateKey, noteId) => {
        const state = get();
        const dayNotes = state.notesByDate[dateKey] || [];
        const note = dayNotes.find(n => n.id === noteId);
        if (!note || note.completed) return;

        const xp = note.xp;

        set((state) => ({
          profile: {
            ...state.profile,
            totalXP: state.profile.totalXP + xp,
          },
          notesByDate: {
            ...state.notesByDate,
            [dateKey]: dayNotes.map(n =>
              n.id === noteId
                ? { ...n, completed: true, completedAt: new Date().toISOString() }
                : n
            ),
          },
        }));
      },

      // --- Streak ---
      checkIn: () => {
        const today = todayKey();
        const { streak } = get();

        if (streak.lastCheckInDate === today) return;

        let newCurrent;
        if (isYesterday(streak.lastCheckInDate)) {
          newCurrent = streak.current + 1;
        } else {
          newCurrent = 1;
        }

        const checkInDates = [...(streak.checkInDates || [])];
        if (!checkInDates.includes(today)) {
          checkInDates.push(today);
        }

        set({
          streak: {
            current: newCurrent,
            longest: Math.max(streak.longest || 0, newCurrent),
            lastCheckInDate: today,
            checkInDates,
          },
          profile: {
            ...get().profile,
            createdAt: get().profile.createdAt || today,
          },
        });
      },

    }),
    {
      name: 'tag-club-data',
      version: 1,
    }
  )
);

export default useStore;
