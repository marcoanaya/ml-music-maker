import React from 'react';
import { Rnd } from 'react-rnd';
import { Maker } from './Maker';
import { Track } from './Track';
import './maker.css';
import { instruments } from '../audio/constants';

const SEGMENT_WIDTH = 20;

interface SegmentProps {
  track: Track;
  segment: Track.Segment;
  children: React.ReactChild;
  id: number;
  handleUpdateSelected: Maker.HandleUpdateSelected;
  handleUpdateSegmentSpan: Maker.HandleUpdateSegmentSpan;
}

const Segment: React.FC<SegmentProps> = ({
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

export default Segment;
