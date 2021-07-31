import { List, OrderedMap } from 'immutable';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import AudioPlayer from './components/audio/AudioPlayer';
import { Instrument, instruments } from './components/audio/constants';
import Maker from './components/maker/Maker';
import { Key } from './components/piano/Key';
import Piano from './components/piano/Piano';

export default function App() {
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [keyToPlaying, setKeyToPlaying] = useState<OrderedMap<Key, boolean>>(OrderedMap<Key, boolean>());
  const [shortcutToKeyMap, setShortcutToKeyMap] = useState<Map<string, Key> | null>(null);
  const [selected, setSelected] = useState(0);
  const [track, setTrack] = useState<List<Key[]>>(List(Array(20).fill([])));
  const [instrument, setInstrument] = useState<Instrument>("piano");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new AudioPlayer(setAudioPlayer); 
    ref.current?.focus();
    const keys = Key.getKeysInBetween("C1", "B6")
    setShortcutToKeyMap(Key.addShortcuts(keys));
    setKeyToPlaying(OrderedMap(keys.map((k) => [k, false]))); 
  }, [])

  const handleDown = (key: Key) => {
    setKeyToPlaying((prev) => prev!.set(key, true));
    audioPlayer?.startNote(key, instrument);
  }

  const handleUp = (key: Key) => {
    setKeyToPlaying((prev) => prev!.set(key, false));
    audioPlayer?.stopNote(key, instrument);
  }

  const handleSelect = (i: number, doIncrease=false) => {
    setTrack((prev) => prev.set(i, Array.from(keyToPlaying.filter((v) => v).keys())));
    setKeyToPlaying((prev) => prev.map((x) => false));
    setSelected((i + Number(doIncrease)) % track.size);
    ref.current?.focus();
  }

  return (
    <div className="app-container"
      onKeyDown={(e) => {
        if (e.key === " ") {
          handleSelect(selected, true);
        } else if (!e.repeat) {
          const key = shortcutToKeyMap?.get(e.key);
          if (key) handleDown(key);
        }
      }}
      onKeyUp={(e) => {
        if (!e.repeat) {
          const key = shortcutToKeyMap?.get(e.key);
          if (key) handleUp(key);
        }
      }}
      tabIndex={-1}
      ref={ref}
    >
      <Maker {...{ audioPlayer, track, instrument, selected, handleSelect}}/>
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
      <Piano {...{ audioPlayer, instrument, keyToPlaying, handleDown, handleUp }}/>
    </div>
  )
}
 