import { List } from "immutable";
import { samples } from "./components/audio/constants";
import { Key } from "./components/piano/Key";


declare type Instrument = keyof typeof samples;

declare type Track = List<{ span: [number, number], keys: Key[] }>;