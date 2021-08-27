import React from 'react';
import { Rnd } from 'react-rnd';
import Key from '../piano/Key';
import * as Track from './Track';
import { instruments } from '../audio/constants';
import { Handlers, Instrument } from '../../global';
import './maker.css';

const SEGMENT_WIDTH = 20;

export type Segment = {
  start: number;
  duration: number;
  keys: Key[];
  instrument: Instrument;
};

interface SegmentProps {
  track: Track.Track;
  segment: Segment;
  children: React.ReactChild;
  id: number;
  handleUpdateSelected: Handlers.UpdateSelected;
  handleUpdateSegmentSpan: Handlers.UpdateSegmentSpan;
}

export const Segment: React.FC<SegmentProps> = ({
  track,
  children,
  id,
  segment: { start, duration, keys, instrument },
  handleUpdateSelected,
  handleUpdateSegmentSpan,
}) => {
  return (
    <Rnd
      className={`segment ${track.i === id && 'active'}`}
      size={{ width: duration * SEGMENT_WIDTH, height: SEGMENT_WIDTH }}
      position={{
        x: start * SEGMENT_WIDTH,
        y:
          instruments.indexOf(track.segments.get(id).instrument) *
          SEGMENT_WIDTH,
      }}
      onDragStop={(e, { lastX, lastY }) => {
        const instrument = instruments[Math.round(lastY / SEGMENT_WIDTH)];
        console.log({ lastX, lastY, instrument });

        if (!instrument) return;
        handleUpdateSegmentSpan(id, {
          start: Math.round(lastX / SEGMENT_WIDTH),
          instrument,
          duration,
          keys,
        });
      }}
      onResizeStop={(e, direction, ref, delta, { x }) => {
        handleUpdateSegmentSpan(id, {
          start: Math.round(x / SEGMENT_WIDTH),
          duration: Math.round(ref.offsetWidth / SEGMENT_WIDTH),
          instrument,
          keys,
        });
      }}
      onClick={() => handleUpdateSelected(id)}
      onDragStart={() => handleUpdateSelected(id)}
      onResizeStart={() => handleUpdateSelected(id)}
      style={{ borderRadius: 5 }}
      minHeight={SEGMENT_WIDTH}
      minWidth={SEGMENT_WIDTH}
      dragGrid={[SEGMENT_WIDTH, SEGMENT_WIDTH]}
      resizeGrid={[SEGMENT_WIDTH, SEGMENT_WIDTH]}
      // bounds={'parent'}
    >
      {children}
    </Rnd>
  );
};
