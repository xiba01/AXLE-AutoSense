import { useAppStore, appStates } from './store/useAppStore';
import { EditorView } from './components/Editor/EditorView';
import { PlaybackView } from './components/Playback/PlaybackView';

function App() {
  const { appState } = useAppStore();

  return (
    <>
      {appState === appStates.EDITOR && <EditorView />}
      {appState === appStates.PLAYBACK && <PlaybackView />}
    </>
  );
}

export default App;
