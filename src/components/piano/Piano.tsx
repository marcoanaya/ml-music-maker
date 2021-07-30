import { useEffect } from 'react';
import { useState } from 'react';
import { OrderedMap } from 'immutable';
import AudioPlayer from '../audio/AudioPlayer';
import { Key } from './Key';
import { instruments, Instrument } from "../audio/constants";
import './piano.css';

export default function Piano({
  audioPlayer,
  setKeysSelected,
}: PianoProps) {
  const [notesToPlaying, setNotesToPlaying] = useState<OrderedMap<Key, boolean> | null>(null);
  const [shortcutToKeyMap, setShortcutToKeyMap] = useState<Map<string, Key> | null>(null);
  const [instrument, setInstrument] = useState<Instrument>("piano");

  useEffect(() => {
    const keys = Key.getKeysInBetween("C1", "B6")
    setShortcutToKeyMap(Key.addShortcuts(keys));
    setNotesToPlaying(OrderedMap(keys.map((k) => [k, false]))); 
  }, [])

  useEffect(() => {
    const listener = (handler: (key: Key) => void) => ((e: KeyboardEvent) => {
      if (!e.repeat){
        const key = shortcutToKeyMap?.get(e.key);
        if (key) handler(key);
      }
    });
    const [onDownListener, onUpListener] = [onDownHandler, onUpHandler].map(listener)
    window.addEventListener("keydown", onDownListener);
    window.addEventListener("keyup", onUpListener);
    return () => {
      window.removeEventListener("keydown", onDownListener);
      window.removeEventListener("keyup", onUpListener);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcutToKeyMap, audioPlayer, instrument])
  
  const onDownHandler = (key: Key) => {
    setNotesToPlaying((prev) => prev!.set(key, true));
    setKeysSelected((prev) => [...prev, key]);
    audioPlayer?.startNote(key, instrument);
  }

  const onUpHandler = (key: Key) => {
    setNotesToPlaying((prev) => prev!.set(key, false));
    setKeysSelected((prev) => prev.filter((k) => Key.compare(k, key)));
    audioPlayer?.stopNote(key, instrument);
  }

  const renderKey = (key: Key, isPlaying: boolean) => {
    return (
      <div 
        className={`piano-${key.getType()}-key-wrapper`} 
        key={key.toString()}
      >
        <button 
          className={`piano-${key.getType()}-key ${isPlaying && "active"}`}
          onMouseDown={() => onDownHandler(key)}
          onMouseUp={() => onUpHandler(key)}
          onMouseLeave={() => onUpHandler(key)}
          onTouchStart={() => onDownHandler(key)}
          onTouchEnd={() => onUpHandler(key)}
        >
          <span className="piano-text">{isPlaying && key.toString()}<br/>{key.shortcut}</span>
        </button>
      </div>
    )
  }

  return (
    <div>
      <select 
        onChange={(e) => setInstrument(e.target.value as Instrument)}
        defaultValue={instrument}
        className="instrument-chooser"
      >
        {instruments.map((instrument, i) => (
          <option 
            value={instrument}
            key={i}
          >{instrument}</option>
        ))}
      </select>
    <div className="piano-container">
      {
        (audioPlayer && notesToPlaying) 
        ? Array.from(notesToPlaying, ([key, isPlaying]) => renderKey(key, isPlaying))
        : "LOADING"
      }
    </div></div>
  )
}

interface PianoProps {
  audioPlayer: AudioPlayer | null;
  setKeysSelected: React.Dispatch<React.SetStateAction<Key[]>>
}