import { OrderedMap } from 'immutable';
import React, { ReactElement } from 'react';
import AudioPlayer from '../audio/AudioPlayer';
import { Key } from './Key';
import './piano.css';

export default function Piano({
  audioPlayer,
  keyToPlaying,
  handleDown,
  handleUp,
}: PianoProps): ReactElement {
  const renderKey = (key: Key, isPlaying: boolean) => {
    return (
      <div
        className={`piano-${key.getType()}-key-wrapper`}
        key={key.toString()}
      >
        <button
          className={`piano-${key.getType()}-key ${isPlaying && 'active'}`}
          onMouseDown={() => handleDown(key)}
          onMouseUp={() => handleUp(key)}
          onMouseLeave={() => handleUp(key)}
          onTouchStart={() => handleDown(key)}
          onTouchEnd={() => handleUp(key)}
        >
          <span className="piano-text">
            {isPlaying && key.toString()}
            <br />
            {key.shortcut}
          </span>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="piano-container">
        {Array.from(keyToPlaying, ([key, isPlaying]) =>
          renderKey(key, isPlaying),
        )}
      </div>
    </div>
  );
}

interface PianoProps {
  audioPlayer: AudioPlayer | null;
  keyToPlaying: OrderedMap<Key, boolean>;
  handleDown: (key: Key) => void;
  handleUp: (key: Key) => void;
}
