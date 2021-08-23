import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Maker } from './Maker';
import { Track } from './Track';
import './maker.css';
import { instruments } from '../audio/constants';

interface SegmentProps {
  track: Track;
  span: [number, number];
  children: React.ReactChild;
  id: number;
  handleUpdateSelected: Maker.HandleUpdateSelected;
  handleUpdateSegmentSpan: Maker.HandleUpdateSegmentSpan;
}

const Segment: React.FC<SegmentProps> = ({
  track,
  children,
  id,
  span: [start, length],
  handleUpdateSelected,
  handleUpdateSegmentSpan,
}) => {
  const [state, setState] = useState({
    // width: 40,
    // height: 40,
    // x: 0,
    y: 0,
  });

  console.log(track.i);
  return (
    <Rnd
      className={`segment ${track.i === id && 'active'}`}
      size={{ width: length * 40, height: 40 }}
      position={{
        x: start * 40,
        y: instruments.indexOf(track.segments[id].instrument) * 40,
      }}
      onDragStop={(e, { lastX, lastY }) => {
        setState((prev) => ({
          y: lastY,
        }));
        handleUpdateSegmentSpan(
          id,
          [Math.round(lastX / 40), length],
          instruments[lastY / 40],
        );
      }}
      onResizeStop={(e, direction, ref, delta, { x, y }) => {
        setState((prev) => ({ y }));
        handleUpdateSegmentSpan(
          id,
          [Math.round(x / 40), Math.round(ref.offsetWidth / 40)],
          track.instrument,
        );
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
