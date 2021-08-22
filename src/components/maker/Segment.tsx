import Interact from '@interactjs/interactjs/node_modules/@interactjs/types/types';
import interact from 'interactjs';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const [counter, setcounter] = useState(0);

  const resizeOptions: Interact.ResizableOptions = {
    edges: { right: true, left: true },
    modifiers: [
      interact.modifiers.restrictEdges({ outer: 'parent' }),
      interact.modifiers.restrictSize({
        min: { width: WIDTH, height: WIDTH },
      }),
      // interact.modifiers.snap({
      //   targets: [interact.snappers.grid({ x: WIDTH, y: WIDTH })],
      //   range: Infinity,
      //   offset: 'parent',
      // }),
    ],
    onmove({ target, rect, deltaRect }: Interact.ResizeEvent) {
      const x = getNum(target, 'x') + Number(deltaRect!.left);
      const y = getNum(target, 'y') + Number(deltaRect!.top);
      target.style.height = `${rect.height}px`;
      target.style.width = `${rect.width}px`;
      transform(target, x, y);
    },
    onend(event: Interact.ResizeEvent) {
      console.log(event.target.style.width);
      handleUpdateSegmentSpan(id, [
        start,
        Math.floor(parseInt(event.target.style.width) / 50),
      ]);
      setcounter((prev) => prev + 1);
    },
  };

  const draggableOptions: Interact.DraggableOptions = {
    modifiers: [
      // interact.modifiers.snap({
      //   targets: [interact.snappers.grid({ x: WIDTH, y: WIDTH })],
      //   range: Infinity,
      //   offset: 'self',
      // }),
      interact.modifiers.restrictRect({ restriction: 'parent' }),
    ],
    onmove({ target, dx, dy }) {
      const x = getNum(target, 'x') + dx;
      const y = getNum(target, 'y') + dy;
      transform(target, x, y);
    },
    onend(event: Interact.ResizeEvent) {
      console.log(event.x0, event.dx);
      handleUpdateSegmentSpan(id, [Math.floor(event.x0 / 50), length]);
      setcounter((prev) => prev + 1);
    },
  };

  useEffect(() => {
    interact(ref.current as Interact.Target)
      .resizable(resizeOptions)
      .draggable(draggableOptions);
  }, []);
  console.log(track.i, counter);
  return (
    <div
      ref={ref}
      className="selection"
      style={{
        backgroundColor: track.i === id ? 'blue' : 'red',
        width: length * WIDTH,
        height: WIDTH,
        transform: `translate(${start * WIDTH}px, ${0}px)`,
      }}
      onClick={() => handleUpdateSelected(id)}
    >
      {children}
    </div>
  );
};

const getNum = (t: Interact.Element, v: 'x' | 'y') =>
  Number(t.getAttribute(`data-${v}`) || 0);

const transform = (t: Interact.Element, x: number, y: number) => {
  t.style.transform = `translate(${x}px, ${y}px)`;
  t.setAttribute('data-x', x.toString());
  t.setAttribute('data-y', y.toString());
};

export default Segment;
