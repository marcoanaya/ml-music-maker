import React, { ReactElement } from 'react';
import { Instrument } from '../../global';
import AudioPlayer from '../audio/AudioPlayer';
import './maker.css';
import Segment from './Segment';
import { Track } from './Track';
import { instruments } from '../audio/constants';

interface MakerProps {
  audioPlayer: AudioPlayer | null;
  track: Track;
  instrument: Instrument;
  setInstrument: React.Dispatch<React.SetStateAction<Instrument>>;
  handleUpdateSelected: Maker.HandleUpdateSelected;
  handleUpdateSegmentSpan: Maker.HandleUpdateSegmentSpan;
}

export default function Maker({
  audioPlayer,
  track,
  instrument,
  setInstrument,
  handleUpdateSelected,
  handleUpdateSegmentSpan,
}: MakerProps): ReactElement {
  return (
    <span>
      <select
        onChange={(e) => setInstrument(e.target.value as Instrument)}
        defaultValue={instrument}
        className="instrument-chooser"
      >
        {instruments.map((instrument, i) => (
          <option value={instrument} key={i}>
            {instrument}
          </option>
        ))}
      </select>
      <div className="maker-container">
        {track.segments.map(({ span, keys }, i) => (
          <Segment
            key={i}
            span={span}
            id={i}
            track={track}
            handleUpdateSelected={handleUpdateSelected}
            handleUpdateSegmentSpan={handleUpdateSegmentSpan}
          >
            {keys.map((k) => k.toString()).toString()}
          </Segment>
        ))}
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
      </div>
    </span>
  );
}

export declare namespace Maker {
  export type HandleUpdateSelected = (id: number) => void;
  export type HandleUpdateSegmentSpan = (
    id: number,
    span: [number, number],
  ) => void;
}
