import interact from "interactjs";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./maker.css";

export default function Segment({
  selected,
  handleSelect,
  children,
}: SegmentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    interact(ref.current as any)
      .resizable({
        edges: {  right: true, left: true },
      
        onmove ({ target, rect, deltaRect}) {
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + deltaRect.left;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + deltaRect.top;
  
          // update the element's style
          target.style.width = rect.width + 'px'
          target.style.height = rect.height + 'px'
  
          target.style.transform = `translate(${x}px, ${y}px)`;
  
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        }
        ,
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({ outer: 'parent' }),
    
          interact.modifiers.restrictSize({
            min: { width: 30, height: 30 }
          }),
          interact.modifiers.snap({
            targets: [ interact.snappers.grid({ x: 30, y: 30 }) ],
            range: Infinity,
            relativePoints: [ { x: 0, y: 0 } ]
          }),
        ],
    
        inertia: true
      })
      .draggable({
        // inertia: true,
        modifiers: [
          interact.modifiers.snap({
            targets: [ interact.snappers.grid({ x: 30, y: 30 }) ],
            range: Infinity,
            relativePoints: [ { x: 0, y: 0 } ]
          }),
          interact.modifiers.restrictRect({ restriction: 'parent' })
        ],
        listeners: {
          // call this function on every dragmove event
          move ({ target, dx, dy }) {
            // keep the dragged position in the data-x/data-y attributes
            const x = (Number(target.getAttribute('data-x')) || 0) + dx
            const y = (Number(target.getAttribute('data-y')) || 0) + dy
          
            // translate the element
            target.style.transform = `translate(${x}px, ${y}px)`;
          
            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },

          // call this function on every dragend event
          end (event) {
            const textEl = event.target.querySelector('p')
            textEl && (textEl.textContent = `${event.pageX} - ${event.x0} + ${event.pageY} - ${event.y0}`)
          }
        }
      })

  }, [])

  return (
    <div 
      ref={ref} 
      style={{backgroundColor:"red"}}
      onClick={() => console.log("EHLJLKJLFKJLKJ")}
    >{children}</div>
  )
}

interface SegmentProps {
  selected: number;
  handleSelect: (i: number) => void;
  children: React.ReactChild;
}
