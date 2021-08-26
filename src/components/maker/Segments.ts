import { Instrument } from '../../global';
import { instruments } from '../audio/constants';
import { Key } from '../piano/Key';
import { Track } from './Track';

const DEFAULT_INSTRUMENT: Instrument = 'piano';

type InstrumentSegmentsMap = Map<
  number,
  { start: number; duration: number; keys: Key.Str[] }
>;
export default class Segments {
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
    return this.highestIndex++;
  }

  update(id: number, { instrument, ...rest }: Track.Segment): void {
    if (this.index.has(id) && instrument !== this.index.get(id)) {
      this.delete(id);
    }
    this.data.get(instrument)!.set(id, rest);
    this.index.set(id, instrument);
  }

  delete(id: number): void {
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
      ([i, { start, duration }]) => {
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
