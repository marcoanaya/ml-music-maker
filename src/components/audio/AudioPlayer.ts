import { List } from "immutable";
import React from "react";
import * as Tone from 'tone';
import { Key } from "../piano/Key";
import { Instrument } from "./constants";
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

  startTrack(track: List<Key[]>, instrument: Instrument) {
    const events = track.toArray().map((a, i) => [i/2, a.map((k) => k.toString())]);
    
    new Tone.Part((time, note) => {
      console.log(note);
      this.synth[instrument].triggerAttackRelease(note, 0.8, time);
    }, events).start(0);
    Tone.Transport.start();
  }

  stopTrack() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
}

