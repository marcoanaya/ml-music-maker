import React from 'react';
import * as Tone from 'tone';
import { Instrument } from '../../global';
import { Track } from '../maker/Track';
import { Key } from '../piano/Key';
import { Sampler } from './Sampler';

export default class AudioPlayer {
  synth: Sampler;
  part?: Tone.Part;

  constructor(
    setAudioPlayer: React.Dispatch<React.SetStateAction<AudioPlayer | null>>,
  ) {
    const onload = () => setAudioPlayer(this);
    this.synth = new Sampler(onload);
  }

  startNote(key: Key, instrument: Instrument): void {
    this.synth.get(instrument).triggerAttack(key.toString());
  }

  stopNote(key: Key, instrument: Instrument): void {
    this.synth.get(instrument).triggerRelease(key.toString());
  }

  startTrack(track: Track): void {
    const { events, paramsIter, end } = track.getPlayParameters();
    console.log({ end });
    Tone.Master.mute = false;
    this.part = new Tone.Part((time, note) => {
      const { duration, instrument } = paramsIter.next().value;
      this.synth.get(instrument).triggerAttackRelease(note, duration, time);

      console.log({ instrument, note, duration, time });
    }, events).start(0);

    Tone.Transport.start();
    setTimeout(() => this.stopTrack(), end * 1000);
  }

  stopTrack(): void {
    Tone.Master.mute = true;
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
}
