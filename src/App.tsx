import React, { useRef, ReactElement, useEffect, useState } from 'react';
import { OrderedMap } from 'immutable';
import AudioPlayer from './components/audio/AudioPlayer';
import Maker from './components/maker/Maker';
import { Track } from './components/maker/Track';
import { Key } from './components/piano/Key';
import Piano from './components/piano/Piano';
import './App.css';
import { Instrument } from './global';

const keys = Key.getKeysInBetween('C1', 'B6');
const shortcutToKeyMap = Key.addShortcuts(keys);

export default function App(): ReactElement {
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [track, setTrack] = useState(new Track());
  const [keyToPlaying, setKeyToPlaying] = useState(
    OrderedMap(keys.map((k) => [k, false])),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new AudioPlayer(setAudioPlayer);
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

  const handleDown = (key: Key) => {
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
      return prev
        .set(id, { keys, instrument: prev.instrument })
        .pushEmptySegment()
        .setSelected();
    });
    setKeyToPlaying((prev) =>
      prev.map((bool, key) => {
        bool && audioPlayer?.stopNote(key, track.instrument);
        return false;
      }),
    );
    ref.current?.focus();
  };

  const handleUpdateSelected = (id: number) =>
    setTrack((prev) => prev.setSelected(id));

  const handleUpdateSegmentSpan = (
    id: number,
    span: [number, number],
    instrument?: Instrument,
  ) => {
    console.log('handle', instrument);
    setTrack((prev) =>
      prev.doesSpanFit(id, span, instrument)
        ? prev.set(id, { span, instrument })
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
            }}
          />
        </>
      ) : (
        'LOADING'
      )}
    </div>
  );
}
