import { OrderedMap } from 'immutable';
import React, { useRef, ReactElement, useEffect, useState } from 'react';
import './App.css';
import AudioPlayer from './components/audio/AudioPlayer';
import { instruments } from './components/audio/constants';
import Maker from './components/maker/Maker';
import { Track } from './components/maker/Track';
import { Key } from './components/piano/Key';
import Piano from './components/piano/Piano';
import { Instrument } from './global';

export default function App(): ReactElement {
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [keyToPlaying, setKeyToPlaying] = useState<OrderedMap<Key, boolean>>(
    OrderedMap<Key, boolean>(),
  );
  const [shortcutToKeyMap, setShortcutToKeyMap] = useState<Map<string, Key>>(
    new Map(),
  );
  const [track, setTrack] = useState<Track>(new Track());
  const [instrument, setInstrument] = useState<Instrument>('piano');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new AudioPlayer(setAudioPlayer);
    ref.current?.focus();
    const keys = Key.getKeysInBetween('C1', 'B6');
    setShortcutToKeyMap(Key.addShortcuts(keys));
    setKeyToPlaying(OrderedMap(keys.map((k) => [k, false])));
  }, []);

  const handleDown = (key: Key) => {
    setKeyToPlaying((prev) => prev?.set(key, true));
    audioPlayer?.startNote(key, instrument);
  };

  const handleUp = (key: Key) => {
    setKeyToPlaying((prev) => prev?.set(key, false));
    audioPlayer?.stopNote(key, instrument);
  };

  const handleUpdateSegmentKey = (id: number) => {
    setTrack((prev) =>
      prev.set(
        id,
        [id, 1],
        Array.from(keyToPlaying.filter((key) => key).keys()),
      ),
    );
    setKeyToPlaying((prev) => prev.map(() => false));
    ref.current?.focus();
  };

  const handleUpdateSelected = (id: number) => {
    setTrack((prev) => prev.updateSelected(id));
  };

  const handleUpdateSegmentSpan = (id: number, span: [number, number]) => {
    setTrack((prev) => {
      if (prev.doesSpanFit(id, span)) {
        console.log('new');
        return prev.set(id, span);
      } else {
        console.log('old');
        return prev;
      }
    });
    console.log(track.toLog());
  };

  return (
    <div
      className="app-container"
      onKeyDown={(e) => {
        if (e.key === ' ') {
          handleUpdateSegmentKey(track.i);
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
      {audioPlayer && keyToPlaying ? (
        <>
          <Maker
            {...{
              audioPlayer,
              track,
              instrument,
              handleUpdateSelected,
              setInstrument,
              handleUpdateSegmentSpan,
            }}
          />
          <Piano
            {...{ audioPlayer, instrument, keyToPlaying, handleDown, handleUp }}
          />
        </>
      ) : (
        'LOADING'
      )}
    </div>
  );
}
