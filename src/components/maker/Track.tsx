import { List } from 'immutable';
import { Key } from '../piano/Key';
import util from 'util';

export class Track {
  segments: List<Track.Segment>;
  i: number;

  constructor(segments?: List<Track.Segment>, i = 0) {
    const seg: Track.Segment = {
      span: [0, 1],
      keys: [],
    };
    this.segments = List(segments || [seg]);
    this.i = i;
  }

  appendEmptySegment(): void {
    this.segments = this.segments.push({
      span: [this.i + 1, 1],
      keys: [],
    });
  }

  findEmptySegmentIndex(): number {
    return this.segments.findIndex((seg) => seg.keys.length === 0);
  }

  set(id: number, span?: [number, number], keys?: Key[]): Track {
    const prevSeg = this.segments.get(id)!;
    span = span || prevSeg.span!;
    keys = keys || prevSeg.keys!;
    this.segments = this.segments.set(id, { span, keys });

    if (this.findEmptySegmentIndex() === -1) this.appendEmptySegment();

    return this.updateSelected();
  }

  updateSelected(i = this.findEmptySegmentIndex()): Track {
    return new Track(this.segments, i);
  }

  doesSpanFit(id: number, span: [number, number]): boolean {
    console.log(
      'span',
      span,
      'does fit',
      this.segments.every(({ span: [start, length] }, d) => {
        return (
          id === d || span[0] >= start + length || span[0] + span[1] <= start
        );
      }),
    );
    return this.segments.every(({ span: [start, length] }, i) => {
      return (
        id === i || span[0] >= start + length || span[0] + span[1] <= start
      );
    });
  }

  toLog(): unknown[] {
    return this.segments
      .map(({ span: [start, length], keys }) => ({
        start,
        end: start + length,
        keys: keys.map((k) => k.toString()).toString(),
      }))
      .toArray();
  }
}

export declare namespace Track {
  export type Segment = {
    span: [number, number];
    keys: Key[];
  };
}
