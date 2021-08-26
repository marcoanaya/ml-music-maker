import React from 'react';
import * as Tone from 'tone';
import { Instrument } from '../../global';
import { Track } from '../maker/Track';
import { Key } from '../piano/Key';
import { Sampler } from './Sampler';

const TEMPO = 0.25;
export declare namespace AudioPlayer {
  export type PlayState = number | 'STOPPED';
  export type HandlePlayStateChange = React.Dispatch<
    React.SetStateAction<AudioPlayer.PlayState>
  >;
}

export class AudioPlayer {
  synth: Sampler;
  part?: Tone.Part;
  handlePlayStateChange: AudioPlayer.HandlePlayStateChange;

  constructor(
    setAudioPlayer: React.Dispatch<React.SetStateAction<AudioPlayer | null>>,
    handlePlayStateChange: AudioPlayer.HandlePlayStateChange,
  ) {
    const onload = () => setAudioPlayer(this);
    this.synth = new Sampler(onload);
    this.handlePlayStateChange = handlePlayStateChange;
  }

  startNote(key: Key.Str, instrument: Instrument): void {
    Tone.Master.mute = false;
    this.synth.get(instrument).triggerAttack(key);
  }

  stopNote(key: Key.Str, instrument: Instrument): void {
    this.synth.get(instrument).triggerRelease(key);
  }

  startTrack(track: Track): void {
    const { events, paramsIter, end } = track.getPlayParameters();
    Tone.Master.mute = false;
    this.part = new Tone.Part((time, note) => {
      const { duration, instrument } = paramsIter.next().value;
      this.synth.get(instrument).triggerAttackRelease(note, duration, time);

      console.log({ instrument, note, duration, time });
    }, events).start(0);

    new Tone.Loop(
      () =>
        this.handlePlayStateChange((prev) =>
          prev === 'STOPPED' ? 1 : prev + 1,
        ),
      TEMPO,
    ).start(0);
    Tone.Transport.start();
    setTimeout(() => this.stopTrack(), end * 1000);
  }

  stopTrack(): void {
    this.handlePlayStateChange('STOPPED');
    Tone.Master.mute = true;
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
}
