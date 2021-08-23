import { Instrument } from '../../global';
import { Key } from '../piano/Key';

export declare namespace Track {
  export type Segment = {
    span: [number, number];
    keys: Key[];
    instrument: Instrument;
  };
}

export class Track {
  segments: Track.Segment[];
  i: number;
  end: number;
  instrument: Instrument;

  constructor(
    segments?: Track.Segment[],
    i = 0,
    end = 1,
    instrument: Instrument = 'bass-electric',
  ) {
    const seg: Track.Segment = { span: [0, 1], keys: [], instrument };
    this.segments = segments || [seg];
    this.i = i;
    this.end = end;
    this.instrument = instrument;
  }

  set(
    id: number,
    {
      span,
      keys,
      instrument,
    }: { span?: [number, number]; keys?: Key[]; instrument?: Instrument },
  ): Track {
    const prevSeg = this.segments[id];
    span = span || prevSeg.span;
    keys = keys || prevSeg.keys;
    instrument = instrument || prevSeg.instrument;
    this.segments[id] = { span, keys, instrument };
    this.end = Math.max(this.end, span[0] + span[1]);

    return this.pushEmptySegment().setSelected();
  }

  pushEmptySegment(): Track {
    if (this.findEmptySegmentIndex() === -1)
      this.segments.push({
        span: [this.end, 1],
        keys: [],
        instrument: this.instrument,
      });
    return this.new();
  }

  setInstrument(instrument: Instrument): Track {
    this.instrument = instrument;
    return this.new();
  }

  setSelected(i = this.findEmptySegmentIndex()): Track {
    this.i = i;
    return this.setInstrument(this.segments[this.i].instrument);
  }

  new(): Track {
    return new Track(this.segments, this.i, this.end, this.instrument);
  }

  findEmptySegmentIndex(): number {
    return this.segments.findIndex(
      (seg) => seg.keys.length === 0 && seg.instrument === this.instrument,
    );
  }

  doesSpanFit(
    id: number,
    span: [number, number],
    potentialInstrument?: Instrument,
  ): boolean {
    console.log({ span, potentialInstrument });
    return this.segments.every(({ span: [start, length], instrument }, i) => {
      return (
        id === i ||
        (potentialInstrument || this.instrument) !== instrument ||
        span[0] >= start + length ||
        span[0] + span[1] <= start
      );
    });
  }

  getPlayParameters(): {
    events: [number, Key.Str[]][];
    end: number;
    paramsIter: IterableIterator<{ duration: number; instrument: Instrument }>;
  } {
    const TEMPO = 0.5;
    const events: [number, Key.Str[]][] = this.segments.map(
      ({ span: [start], keys }) => [
        start * TEMPO,
        keys.map((k: Key) => k.toString()),
      ],
    );
    const paramsIter = this.segments
      .map(({ span: [, length], instrument }) => ({
        duration: length * TEMPO,
        instrument,
      }))
      .values();
    return { events, paramsIter, end: this.end * TEMPO };
  }

  toLog(): unknown[] {
    return this.segments.map(({ span: [start, length], keys }) => ({
      start,
      end: start + length,
      keys: keys.map((k) => k.toString()).toString(),
    }));
  }
}
