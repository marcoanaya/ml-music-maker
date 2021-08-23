import Interact from '@interactjs/interactjs/node_modules/@interactjs/types/types';
import interact from 'interactjs';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Maker } from './Maker';
import './maker.css';
import { Track } from './Track';

const WIDTH = 50;

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
    width: 50,
    height: 50,
    x: 0,
    y: 0,
  });

  console.log(track.i);
  return (
    <Rnd
      size={{ width: length * 50, height: 50 }}
      position={{ x: start * 50, y: state.y }}
      onDragStop={(e, { lastX, lastY }) => {
        setState((prev) => ({
          ...prev,
          // x: lastX,
          y: lastY,
        }));
        handleUpdateSegmentSpan(id, [Math.round(lastX / 50), length]);
      }}
      onResizeStop={(e, direction, ref, delta, { x, y }) => {
        setState((prev) => ({
          ...prev,
          // width: ref.offsetWidth,
          x,
          y,
        }));
        handleUpdateSegmentSpan(id, [
          Math.round(x / 50),
          Math.round(ref.offsetWidth / 50),
        ]);
      }}
      onClick={() => handleUpdateSelected(id)}
      style={{
        backgroundColor: track.i === id ? 'blue' : 'red',
        borderRadius: 10,
      }}
      minHeight={50}
      minWidth={50}
      dragGrid={[50, 50]}
      resizeGrid={[50, 50]}
      bounds={'parent'}
    >
      {children}
    </Rnd>
  );
};

export default Segment;
