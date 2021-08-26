import React from 'react';
import { Instrument } from '../../global';
import { AudioPlayer } from '../audio/AudioPlayer';
import { instruments } from '../audio/constants';
import Segment from './Segment';
import { Track } from './Track';
import './maker.css';
import { useState } from 'react';

export declare namespace Maker {
  export type HandleUpdateSelected = (id: number) => void;
  export type HandleUpdateSegmentSpan = (
    id: number,
    segment: Track.Segment,
  ) => void;
}

interface MakerProps {
  audioPlayer: AudioPlayer | null;
  track: Track;
  instrument: Instrument;
  playState: AudioPlayer.PlayState;
  setInstrument: (instrument: Instrument) => void;
  handleUpdateSelected: Maker.HandleUpdateSelected;
  handleUpdateSegmentSpan: Maker.HandleUpdateSegmentSpan;
}

const Maker: React.FC<MakerProps> = ({
  audioPlayer,
  track,
  setInstrument,
  playState,
  handleUpdateSelected,
  handleUpdateSegmentSpan,
}) => {
  console.log(track.i);

  return (
    <span>
      <div className="maker-container">
        <div className="instruments">
          {playState === 'STOPPED' ? (
            <button onClick={() => audioPlayer?.startTrack(track)}>play</button>
          ) : (
            <button onClick={() => audioPlayer?.stopTrack()}>stop</button>
          )}
          <ul>
            {instruments.map((instrument) => (
              <li key={instrument}>{instrument}</li>
            ))}
          </ul>
        </div>
        <div className="track-container">
          <div className="label-wrapper">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div className="label" key={i}>
                  {i}
                </div>
              ))}
          </div>
          <div className="segment-container">
            {track.segments.entries().map(([id, segment]) => (
              <Segment
                key={id}
                segment={segment}
                id={id}
                track={track}
                handleUpdateSelected={handleUpdateSelected}
                handleUpdateSegmentSpan={handleUpdateSegmentSpan}
              >
                {segment.keys.map((k) => k.toString()).toString()}
              </Segment>
            ))}
          </div>
        </div>
      </div>
    </span>
  );
};

export default Maker;
