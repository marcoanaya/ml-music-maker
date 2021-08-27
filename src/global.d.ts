import { samples } from './components/audio/constants';

declare type Instrument = keyof typeof samples;

declare namespace Handlers {
  export type UpdateSelected = (id: number) => void;
  export type UpdateSegmentSpan = (id: number, segment: Track.Segment) => void;
  export type UpdateInstrument = (instrument: Instrument) => void;
}
