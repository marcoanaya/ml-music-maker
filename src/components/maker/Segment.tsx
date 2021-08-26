import React from 'react';
import { Rnd } from 'react-rnd';
import { Maker } from './Maker';
import { Track } from './Track';
import './maker.css';
import { instruments } from '../audio/constants';

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
      size={{ width: duration * 40, height: 40 }}
      position={{
        x: start * 40,
        y: instruments.indexOf(track.segments.get(id).instrument) * 40,
      }}
      onDragStop={(e, { lastX, lastY }) => {
        handleUpdateSegmentSpan(id, {
          start: Math.round(lastX / 40),
          instrument: instruments[lastY / 40],
          duration,
          keys,
        });
      }}
      onResizeStop={(e, direction, ref, delta, { x }) => {
        handleUpdateSegmentSpan(id, {
          start: Math.round(x / 40),
          duration: Math.round(ref.offsetWidth / 40),
          instrument,
          keys,
        });
      }}
      onClick={() => handleUpdateSelected(id)}
      onDragStart={() => handleUpdateSelected(id)}
      onResizeStart={() => handleUpdateSelected(id)}
      style={{ borderRadius: 10 }}
      minHeight={40}
      minWidth={40}
      dragGrid={[40, 40]}
      resizeGrid={[40, 40]}
      bounds={'parent'}
    >
      {children}
    </Rnd>
  );
};

export default Segment;
