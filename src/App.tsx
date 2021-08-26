import React, { useRef, ReactElement, useEffect, useState } from 'react';
import { OrderedMap } from 'immutable';
import { AudioPlayer } from './components/audio/AudioPlayer';
import Maker from './components/maker/Maker';
import { Track } from './components/maker/Track';
import { Key } from './components/piano/Key';
import Piano from './components/piano/Piano';
import './App.css';

const keys = Key.getKeysInBetween('C1', 'B6');
const shortcutToKeyMap = Key.addShortcuts(keys);

export default function App(): ReactElement {
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [playState, setPlayState] = useState<AudioPlayer.PlayState>('STOPPED');
  const [track, setTrack] = useState(new Track());
  const [keyToPlaying, setKeyToPlaying] = useState(
    OrderedMap(keys.map((k) => [k, false])),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new AudioPlayer(setAudioPlayer, setPlayState);
    ref.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      handleUpdateSegmentKey(track.i);
    } else if (!e.repeat) {
      const key = shortcutToKeyMap?.get(e.key);
      if (key) handleDown(key);
    }
  };

  const handleDown = (key: Key.Str) => {
    setKeyToPlaying((prev) =>
      prev?.update(key, (bool) => {
        bool
          ? audioPlayer?.stopNote(key, track.instrument)
          : audioPlayer?.startNote(key, track.instrument);
        return !bool;
      }),
    );
  };

  const handleUpdateSegmentKey = (id: number) => {
    setTrack((prev) => {
      const keys = Array.from(keyToPlaying.filter((key) => key).keys());
      return keys.length === 0
        ? prev.setSelected().remove(id)
        : prev.set(id, { keys, instrument: prev.instrument }).setSelected();
    });
    setKeyToPlaying((prev) =>
      prev.map((bool, key) => {
        bool && audioPlayer?.stopNote(key, track.instrument);
        return false;
      }),
    );
    ref.current?.focus();
  };

  const handleUpdateSelected = (id: number) => {
    setTrack((prev) => prev.setSelected(id));
  };
  const handleUpdateSegmentSpan = (id: number, segment: Track.Segment) => {
    setTrack((prev) =>
      prev.segments.doesSpanFit(id, segment)
        ? prev.set(id, segment).setInstrument()
        : prev,
    );
  };

  return (
    <div
      className="app-container"
      onKeyDown={onKeyDown}
      tabIndex={-1}
      ref={ref}
    >
      {audioPlayer ? (
        <>
          <Maker
            {...{
              audioPlayer,
              track,
              instrument: track.instrument,
              playState,
              setInstrument: (instrument) =>
                setTrack((prev) => prev.setInstrument(instrument)),
              handleUpdateSelected,
              handleUpdateSegmentSpan,
            }}
          />
          <Piano
            {...{
              audioPlayer,
              instrument: track.instrument,
              keyToPlaying,
              handleDown,
              shortcuts: Array.from(shortcutToKeyMap.keys()),
            }}
          />
        </>
      ) : (
        'LOADING'
      )}
    </div>
  );
}
