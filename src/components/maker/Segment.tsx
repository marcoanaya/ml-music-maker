import interact from 'interactjs';
import React from 'react';
import { ReactElement } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import './maker.css';

const WIDTH = 50;

const getNum = (t: any, v: 'x' | 'y') =>
  Number(t.getAttribute(`data-${v}`) || 0);
const transform = (t: any, x: number, y: number) => {
  t.style.transform = `translate(${x}px, ${y}px)`;
  t.setAttribute('data-x', x);
  t.setAttribute('data-y', y);
};
export default function Segment({
  selected,
  handleChangeSegment,
  children,
  id,
  span: [start, length],
}: SegmentProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    interact(ref.current as any)
      .resizable({
        edges: { right: true, left: true },
        onmove({ target, rect, deltaRect }) {
          const x = getNum(target, 'x') + deltaRect.left;
          const y = getNum(target, 'y') + deltaRect.top;
          ['height', 'width'].forEach(
            (x) => (target.style[x] = `${rect[x]}px`),
          );
          transform(target, x, y);
        },
        onend(event) {
          console.log(
            `${event.pageX} - ${event.x0} + ${event.pageY} - ${event.y0}`,
          );
          console.log(event.rect.left);
        },
        modifiers: [
          interact.modifiers.restrictEdges({ outer: 'parent' }),

          interact.modifiers.restrictSize({
            min: { width: WIDTH, height: WIDTH },
          }),
          interact.modifiers.snap({
            targets: [interact.snappers.grid({ x: WIDTH, y: WIDTH })],
            range: Infinity,
            offset: 'parent',
          }),
        ],
      })
      .draggable({
        onmove({ target, dx, dy }) {
          const x = getNum(target, 'x') + dx;
          const y = getNum(target, 'y') + dy;
          transform(target, x, y);
        },
        onend(event) {
          console.log(`${event.x0} + ${event.y0}`);
        },
        modifiers: [
          interact.modifiers.snap({
            targets: [interact.snappers.grid({ x: WIDTH, y: WIDTH })],
            range: Infinity,
            offset: 'self',
          }),
          interact.modifiers.restrictRect({ restriction: 'parent' }),
        ],
      });
  }, []);

  return (
    <div
      ref={ref}
      className="selection"
      style={{
        backgroundColor: 'red',
        width: length * WIDTH,
        height: WIDTH,
      }}
      onClick={() => console.log('EHLJLKJLFKJLKJ')}
    >
      {children}
    </div>
  );
}

interface SegmentProps {
  selected: number;
  span: [number, number];
  handleChangeSegment: (id: number, span: [number, number]) => void;
  children: React.ReactChild;
  id: number;
}
