import { Instrument } from '../../global';
import { instruments } from '../audio/constants';
import Key from '../piano/Key';
import { Segment } from './Track';

const DEFAULT_INSTRUMENT: Instrument = 'piano';

type InstrumentSegmentsMap = Map<
  number,
  { start: number; duration: number; keys: Key[] }
>;
export class Segments {
  index = new Map<number, Instrument>();
  data = new Map<Instrument, InstrumentSegmentsMap>(
    instruments.map((i) => [i, new Map()]),
  );
  highestIndex = 0;

  constructor() {
    this.set();
  }

  get(id: number): Segment {
    const instrument = this.index.get(id)!;
    return { instrument, ...this.data.get(instrument)!.get(id)! };
  }

  getInstrumentMap(id: number): InstrumentSegmentsMap {
    const instrument = this.index.get(id)!;
    return this.data.get(instrument)!;
  }

  set(partialSegment?: Partial<Segment>): number {
    const segment = {
      instrument: DEFAULT_INSTRUMENT,
      start: 0,
      duration: 1,
      keys: [],
      ...partialSegment,
    };
    this.update(this.highestIndex, segment);
    return this.highestIndex++;
  }

  update(id: number, { instrument, ...rest }: Segment): void {
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
    let min = { id: -1, start: Infinity };
    for (const [id, { start }] of this.getInstrumentMap(prevId).entries()) {
      if (segment.start < start && start < min.start) {
        min = { id, start };
      }
    }
    return min.id !== -1
      ? min.id
      : this.set({
          instrument: segment.instrument,
          start: segment.start + segment.duration,
        });
  }

  append(instrument: Instrument): number {
    const start = [...this.data.get(instrument)!.entries()].reduce(
      (max, [, { start, duration }]) => Math.max(max, start + duration),
      0,
    );
    return this.set({ start, instrument });
  }

  doesSpanFit(id: number, segment: Segment): boolean {
    console.log({ id, segment });

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

  getInstrumentEntries(instrument: Instrument): [number, Segment][] {
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

  entries(): [number, Segment][] {
    return Array.from(this.data.keys()).reduce(
      (acc, instrument) => [...acc, ...this.getInstrumentEntries(instrument)],
      Array<[number, Segment]>(),
    );
  }
}
