import React from "react";
import * as Tone from 'tone';
import { Instrument, Track } from "../../global";
import { Key } from "../piano/Key";
import { Sampler } from "./Sampler";

export default class AudioPlayer {
  synth: Sampler;

  constructor(setAudioPlayer: React.Dispatch<React.SetStateAction<AudioPlayer | null>>) {
    const onload = () => setAudioPlayer(this);
    this.synth = new Sampler(onload);
  }

  startNote(key: Key, instrument: Instrument) {
    this.synth[instrument].triggerAttack(key.toString());
  }

  stopNote(key: Key, instrument: Instrument) {
    this.synth[instrument].triggerRelease(key.toString());
  }

  startTrack(track: Track, instrument: Instrument) {
    console.log(track);
    const events = track.toArray().map(( { span: [s, e], keys }) => [[s/2, e/2], keys.map((k) => k.toString())]);
    console.log(events);
    let i = 0;
    new Tone.Part((time, note) => {
      const duration = events[i][0][1]
      this.synth[instrument].triggerAttackRelease(note, duration, time);
      i++;
    }, events.map(([[start, end], keys]) => [start, keys])).start(0);
    Tone.Transport.start();
  }

  stopTrack() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
}

