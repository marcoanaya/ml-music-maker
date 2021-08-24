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
  instrument: Instrument;

  constructor(
    segments?: Track.Segment[],
    i = 0,
    instrument: Instrument = 'bass-electric',
  ) {
    const seg: Track.Segment = { span: [0, 1], keys: [], instrument };
    this.segments = segments || [seg];
    this.i = i;
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

    return this.new();
  }

  pushEmptySegment(): Track {
    if (this.findEmptySegmentIndex() === -1) {
      const last = this.segments.reduce(
        (acc, { span: [start, length], instrument }) => {
          return instrument == this.instrument
            ? Math.max(acc, start + length)
            : acc;
        },
        0,
      );
      this.segments.push({
        span: [last, 1],
        keys: [],
        instrument: this.instrument,
      });
    }

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
    return new Track(this.segments, this.i, this.instrument);
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
      .map((e, i) => [i, e] as [number, Track.Segment])
      .sort(([i, a], [j, b]) => a.span[0] - b.span[0] || i - j)
      .map(([, e]) => e)
      .map(({ span: [, length], instrument }) => ({
        duration: length * TEMPO,
        instrument,
      }))
      .values();
    const end =
      TEMPO *
      Math.max(
        ...this.segments.map(({ span: [start, duration] }) => start + duration),
      );

    return { events, paramsIter, end };
  }
}
