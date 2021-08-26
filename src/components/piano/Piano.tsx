import { OrderedMap } from 'immutable';
import React, { ReactElement } from 'react';
import { AudioPlayer } from '../audio/AudioPlayer';
import { Key } from './Key';
import './piano.css';

export default function Piano({
  audioPlayer,
  keyToPlaying,
  shortcuts,
  handleDown,
}: PianoProps): ReactElement {
  const renderKey = (key: Key.Str, isPlaying: boolean, shortcut: string) => {
    return (
      <div
        className={`piano-${Key.getType(key)}-key-wrapper`}
        key={key.toString()}
      >
        <button
          className={`piano-${Key.getType(key)}-key ${isPlaying && 'active'}`}
          onMouseDown={() => handleDown(key)}
          // onMouseUp={() => handleUp(key)}
          // onMouseLeave={() => handleUp(key)}
          onTouchStart={() => handleDown(key)}
          // onTouchEnd={() => handleUp(key)}
        >
          <span className="piano-text">
            {isPlaying && key}
            <br />
            {shortcut}
          </span>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="piano-container">
        {Array.from(keyToPlaying, ([key, isPlaying], i) =>
          renderKey(key, isPlaying, shortcuts[i]),
        )}
      </div>
    </div>
  );
}

interface PianoProps {
  audioPlayer: AudioPlayer | null;
  keyToPlaying: OrderedMap<Key.Str, boolean>;
  handleDown: (key: Key.Str) => void;
  shortcuts: string[];
}
