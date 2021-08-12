import React, { ReactElement } from 'react';
import { Instrument, Track } from '../../global';
import AudioPlayer from '../audio/AudioPlayer';
import './maker.css';
import Segment from './Segment';

export default function Maker({
  audioPlayer,
  track,
  instrument,
  selected,
  handleChangeSegment,
}: MakerProps): ReactElement {
  return (
    <div className="maker-container">
      <button onClick={() => audioPlayer?.startTrack(track, instrument)}>
        play
      </button>
      <button onClick={() => audioPlayer?.stopTrack()}>stop</button>
      <div className="label-wrapper">
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <div className="label" key={i}>
              {i}
            </div>
          ))}
      </div>
      {/* <div className="selection-wrapper"> */}
      {track.map(({ span, keys }, i) => (
        <Segment
          key={i}
          span={span}
          id={i}
          selected={selected}
          handleChangeSegment={handleChangeSegment}
        >
          {keys.map((k) => k.toString()).toString()}
        </Segment>
      ))}
      {/* </div> */}
    </div>
  );
}

interface MakerProps {
  audioPlayer: AudioPlayer | null;
  track: Track;
  instrument: Instrument;
  selected: number;
  handleChangeSegment: (id: number, span: [number, number]) => void;
}
