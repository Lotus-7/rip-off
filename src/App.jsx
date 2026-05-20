import { useEffect, useState } from 'react';
import useStore from './hooks/useStore';
import TopBar from './components/TopBar';
import ProgressBar from './components/ProgressBar';
import CategoryTabs from './components/CategoryTabs';
import NoteBoard from './components/NoteBoard';
import CompletedShelf from './components/CompletedShelf';
import AddNoteModal from './components/AddNoteModal';
import WeeklyView from './components/WeeklyView';
import StatsPanel from './components/StatsPanel';
import './App.css';

function App() {
  const checkIn = useStore(s => s.checkIn);
  const currentView = useStore(s => s.currentView);
  const setCurrentView = useStore(s => s.setCurrentView);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    checkIn();
  }, [checkIn]);

  return (
    <div className="app">
      <TopBar onAdd={() => setModalOpen(true)} />
      <div className="view-tabs">
        <button className={currentView === 'today' ? 'view-tab active' : 'view-tab'} onClick={() => setCurrentView('today')}>今天</button>
        <button className={currentView === 'weekly' ? 'view-tab active' : 'view-tab'} onClick={() => setCurrentView('weekly')}>本周</button>
        <button className={currentView === 'stats' ? 'view-tab active' : 'view-tab'} onClick={() => setCurrentView('stats')}>统计</button>
      </div>
      {currentView === 'today' && (
        <>
          <ProgressBar />
          <CategoryTabs />
          <NoteBoard onAdd={() => setModalOpen(true)} />
          <CompletedShelf />
        </>
      )}
      {currentView === 'weekly' && <WeeklyView />}
      {currentView === 'stats' && <StatsPanel />}
      {modalOpen && <AddNoteModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

export default App;
