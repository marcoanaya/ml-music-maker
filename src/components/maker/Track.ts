import { Instrument } from '../../global';
import { Key } from '../piano/Key';
import Segments from './Segments';

const DEFAULT_INSTRUMENT: Instrument = 'piano';

export declare namespace Track {
  export type Segment = {
    start: number;
    duration: number;
    keys: Key.Str[];
    instrument: Instrument;
  };
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
