import { useAppStore, appStates } from './store/useAppStore';
import { EditorView } from './components/Editor/EditorView';
import { PlaybackView } from './components/Playback/PlaybackView';
import { ErrorBoundary } from './components/Shared/ErrorBoundary';

function App() {
  const { appState } = useAppStore();

  return (
    <div className="relative min-h-screen">
      <ErrorBoundary>
        {appState === appStates.EDITOR && <EditorView />}
        {appState === appStates.PLAYBACK && <PlaybackView />}
      </ErrorBoundary>
    </div>
  );
}

export default App;
