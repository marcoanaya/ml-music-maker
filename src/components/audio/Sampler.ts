import * as Tone from "tone";
import { Instrument } from "../../global";
import { samples, instruments } from "./constants";

const MINIFY = true;

export class Sampler {
  [k: string]: Tone.Sampler;

  constructor(onload: () => void, selectedInstruments: Instrument[] = instruments) {

    for (const instrument of selectedInstruments) {
      const baseUrl = `${process.env.PUBLIC_URL}/samples/${instrument}/`;
      let urls: {[k:string]: string} = samples[instrument];

      if (MINIFY) {
        const minBy = Math.floor(Object.keys(urls).length / 15) || 1;

        urls = Object.entries(urls).reduce((acc, [key, url], i) => {
            if (i % minBy === 0) acc[key] = url;
            return acc;
        }, {} as {[k:string]: string});
      }
      this[instrument] = new Tone.Sampler({
        urls, 
        onload, 
        baseUrl,
      }).toDestination();
    }
  }
}
