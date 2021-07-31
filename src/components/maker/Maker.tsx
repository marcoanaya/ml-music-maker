import { List } from "immutable";
import AudioPlayer from "../audio/AudioPlayer";
import { Instrument } from "../audio/constants";
import { Key } from "../piano/Key";
import "./maker.css";
import Segment from "./Segment";

export default function Maker({
  audioPlayer,
  track,
  instrument,
  selected,
  handleSelect,
}: MakerProps) {

  return (
    <div className="maker-container">
      <button onClick={() => audioPlayer?.startTrack(track, instrument)}>play</button>
      <button onClick={() => audioPlayer?.stopTrack()}>stop</button>      
      <div className="label-wrapper">
        {Array(track.size / 4).fill(0).map((_, i) => (
          <div className="label"
            key={i}
          >{i}</div>
        ))}
      </div>
      <div className="selection-wrapper">
        {track.map((keys, i) => (
          <button className="selection" style={i===selected? {backgroundColor: "darkcyan"}: {}}
            onClick={() => handleSelect(i)}
            key={i}
          >{keys.map((k) => k.toString())}</button>
        ))}
      </div>
    </div>
  )
}

interface MakerProps {
  audioPlayer: AudioPlayer | null;
  track: List<Key[]>;
  instrument: Instrument;
  selected: number;
  handleSelect: (i: number) => void;
}
