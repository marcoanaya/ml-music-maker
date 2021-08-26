import { Instrument } from '../../global';
import { instruments } from '../audio/constants';
import { Key } from '../piano/Key';

const DEFAULT_INSTRUMENT: Instrument = 'piano';

export declare namespace Track {
  export type Segment = {
    start: number;
    duration: number;
    keys: Key.Str[];
    instrument: Instrument;
  };
}

type InstrumentSegmentsMap = Map<
  number,
  { start: number; duration: number; keys: Key.Str[] }
>;
class Segments {
  index = new Map<number, Instrument>();
  data = new Map<Instrument, InstrumentSegmentsMap>(
    instruments.map((i) => [i, new Map()]),
  );
  highestIndex = 0;

  constructor() {
    this.set({
      instrument: DEFAULT_INSTRUMENT,
      start: 0,
      duration: 1,
      keys: [],
    });
  }

  get(id: number): Track.Segment {
    const instrument = this.index.get(id)!;
    return { instrument, ...this.data.get(instrument)!.get(id)! };
  }

  getInstrumentMap(id: number): InstrumentSegmentsMap {
    const instrument = this.index.get(id)!;
    return this.data.get(instrument)!;
  }

  set(segment: Track.Segment): number {
    this.update(this.highestIndex, segment);
    const log = (i: number) => {
      console.log('set', i);
      return i;
    };
    return log(this.highestIndex++);
  }

  update(id: number, { instrument, ...rest }: Track.Segment): void {
    console.log('update', id);
    if (this.index.has(id) && instrument !== this.index.get(id)) {
      this.delete(id);
    }
    this.data.get(instrument)!.set(id, rest);
    this.index.set(id, instrument);
  }

  delete(id: number): void {
    console.log('delete', id);
    this.getInstrumentMap(id).delete(id);
    this.index.delete(id);
  }

  getNextId(prevId: number): number {
    const segment = this.get(prevId);
    let max = { id: -1, start: -1 };
    for (const [id, { start }] of this.getInstrumentMap(prevId).entries()) {
      if (segment.start + segment.start < start && start > max.start) {
        max = { id, start };
      }
    }
    return max.id !== -1
      ? max.id
      : this.set({
          instrument: segment.instrument,
          start: segment.start + segment.duration,
          duration: 1,
          keys: [],
        });
  }

  doesSpanFit(id: number, segment: Track.Segment): boolean {
    return this.getInstrumentEntries(segment.instrument).every(
      ([, { start, duration }], i) => {
        return (
          id === i ||
          segment.start >= start + duration ||
          segment.start + segment.duration <= start
        );
      },
    );
  }

  getInstrumentEntries(instrument: Instrument): [number, Track.Segment][] {
    return Array.from(this.data.get(instrument)!.entries()).map(
      ([id, rest]) => [
        id,
        {
          instrument,
          ...rest,
        },
      ],
    );
  }

  entries(): [number, Track.Segment][] {
    return Array.from(this.data.keys()).reduce(
      (acc, instrument) => [...acc, ...this.getInstrumentEntries(instrument)],
      [] as [number, Track.Segment][],
    );
  }
}

export class Track {
  segments: Segments;
  i: number;
  instrument: Instrument;

  constructor(segments?: Segments, i = 0, instrument = DEFAULT_INSTRUMENT) {
    this.segments = segments !== undefined ? segments : new Segments();
    this.i = i;
    this.instrument = instrument;
  }

  set(id: number, newSegment: Partial<Track.Segment>): Track {
    const segment = { ...this.segments.get(id), ...newSegment };
    this.segments.update(id, segment);
    return this.clone();
  }

  remove(id: number): Track {
    this.segments.delete(id);
    return this.clone();
  }

  setInstrument(instrument?: Instrument): Track {
    this.instrument = instrument || this.segments.get(this.i).instrument;
    return this.clone();
  }

  setSelected(i?: number): Track {
    this.i = i !== undefined ? i : this.segments.getNextId(this.i);
    console.log(this.i);
    return this.clone();
  }

  clone(): Track {
    return new Track(this.segments, this.i, this.instrument);
  }

  getPlayParameters(): {
    events: [number, Key.Str[]][];
    end: number;
    paramsIter: IterableIterator<{ duration: number; instrument: Instrument }>;
  } {
    const TEMPO = 0.5;
    const segments = this.segments.entries();
    const events: [number, Key.Str[]][] = segments.map(
      ([, { start, keys }]) => [start * TEMPO, keys],
    );
    const paramsIter = segments
      .map(([, e], i) => [i, e] as [number, Track.Segment])
      .sort(([i, a], [j, b]) => a.start - b.start || i - j)
      .map(([, e]) => e)
      .map(({ duration, instrument }) => ({
        duration: duration * TEMPO,
        instrument,
      }))
      .values();
    const end =
      TEMPO *
      Math.max(...segments.map(([, { start, duration }]) => start + duration));

    return { events, paramsIter, end };
  }
}
