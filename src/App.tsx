import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import AudioPlayer from './components/audio/AudioPlayer';
import { Key } from './components/piano/Key';
import Piano from './components/piano/Piano';

export default function App() {
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [keysSelected, setKeysSelected] = useState<Key[]>([]);

  useEffect(() => {
    new AudioPlayer(setAudioPlayer); 
  }, [])

  console.log(keysSelected)

  return (
    <div className="app-container">
      <Piano {...{ audioPlayer, setKeysSelected }}/>
    </div>
  )
}
 