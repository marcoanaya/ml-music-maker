import { List } from 'immutable';
import { Key } from '../piano/Key';
import util from 'util';

export class Track {
  segments: List<Track.Segment>;
  i: number;
  end: number;

  constructor(segments?: List<Track.Segment>, i = 0, end = 1) {
    const seg: Track.Segment = {
      span: [0, 1],
      keys: [],
    };
    this.segments = List(segments || [seg]);
    this.i = i;
    this.end = end;
  }

  new(): Track {
    return new Track(this.segments, this.i, this.end);
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
    this.end = Math.max(this.end, span[0] + span[1]);
    console.log({ end: this.end, sum: span[0] + span[1] });

    if (this.findEmptySegmentIndex() === -1) this.appendEmptySegment();

    return this.updateSelected();
  }

  updateSelected(i = this.findEmptySegmentIndex()): Track {
    this.i = i;
    return this.new();
  }

  doesSpanFit(id: number, span: [number, number]): boolean {
    console.log('span', span);
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

  getPlayParameters() {
    const TEMPO = 0.5;
    const events = this.segments
      .toArray()
      .map(({ span: [start], keys }) => [
        start * TEMPO,
        keys.map((k: Key) => k.toString()),
      ]);
    const durationIter = this.segments
      .map(({ span: [, length] }) => length * TEMPO)
      .values();

    return { events, durationIter, end: this.end * TEMPO };
  }
}

export declare namespace Track {
  export type Segment = {
    span: [number, number];
    keys: Key[];
  };
}
