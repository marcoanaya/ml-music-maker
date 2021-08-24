import * as Tone from 'tone';
import { Instrument } from '../../global';
import { samples, instruments } from './constants';

const MINIFY = true;

export class Sampler {
  samplers: Map<
    Instrument,
    {
      sampler: Tone.Sampler;
      volume: Tone.Volume;
    }
  >;

  constructor(
    onload: () => void,
    selectedInstruments: Instrument[] = instruments,
  ) {
    this.samplers = new Map();
    for (const instrument of selectedInstruments) {
      const baseUrl = `${process.env.PUBLIC_URL}/samples/${instrument}/`;
      let urls: { [k: string]: string } = samples[instrument];

      if (MINIFY) {
        const minBy = Math.floor(Object.keys(urls).length / 15) || 1;

        urls = Object.entries(urls).reduce((acc, [key, url], i) => {
          if (i % minBy === 0) acc[key] = url;
          return acc;
        }, {} as { [k: string]: string });
      }
      const volume = new Tone.Volume().toDestination();
      volume.mute = true;
      const sampler = new Tone.Sampler({
        urls,
        onload,
        baseUrl,
      })
        .connect(volume)
        .toDestination();
      this.samplers.set(instrument, { volume, sampler });
    }
  }

  get(instrument: Instrument): Tone.Sampler {
    return this.samplers.get(instrument)!.sampler;
  }

  setVolume(instrument: Instrument, value: Tone.Unit.Decibels): void {
    const volume = this.samplers.get(instrument)!.volume;
    volume.volume.value = value;
  }
}
