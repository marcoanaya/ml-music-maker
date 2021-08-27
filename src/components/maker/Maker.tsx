import React from 'react';
import { Handlers, Instrument } from '../../global';
import { AudioPlayer } from '../audio/AudioPlayer';
import { instruments } from '../audio/constants';
import { Segment } from './Segment';
import * as Track from './Track';
import './maker.css';

interface MakerProps {
  audioPlayer: AudioPlayer | null;
  track: Track.Track;
  instrument: Instrument;
  playState: AudioPlayer.PlayState;
  handleUpdateInstrument: Handlers.UpdateInstrument;
  handleUpdateSelected: Handlers.UpdateSelected;
  handleUpdateSegmentSpan: Handlers.UpdateSegmentSpan;
}

export const Maker: React.FC<MakerProps> = ({
  audioPlayer,
  track,
  playState,
  handleUpdateInstrument,
  handleUpdateSelected,
  handleUpdateSegmentSpan,
}) => {
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
            {Array(track.size / 4)
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
