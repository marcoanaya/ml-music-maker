import { accidentalShortcuts, naturalShortcuts } from './shortcuts';

type Key = `${Note}${number}`;
export default Key;

export type Note = typeof notes[number];
export type Type = 'accidental' | 'natural';

export class KeyUtil {
  /* Gets the 'type' of the key, i.e. in a piano black (accidental) or white (natural) */
  static getType(key: Key): Type {
    return key.length > 2 ? 'accidental' : 'natural';
  }

  /* Gets the next (higher) key */
  static getNextKey(key: Key): Key {
    const { note, octave } = KeyUtil.getNoteAndOctave(key);
    const i = (notes.indexOf(note) + 1) % notes.length;
    return `${notes[i]}${octave + Number(i === 0)}`;
  }

  /* Converts key to Keying */
  static getNoteAndOctave(key: Key): {
    note: Note;
    octave: number;
  } {
    const [, note, octave] = key.match(/([A-G][#]?)([1-9])/)!;
    return { note, octave: Number(octave) } as {
      note: Note;
      octave: number;
    };
  }

  /* Compares key a to key b. Returns:
   *   -1 if a < b
   *    0 if a = b
   *    1 if a > b
   */
  static compare(key1: Key, key2: Key): number {
    const a = this.getNoteAndOctave(key1);
    const b = this.getNoteAndOctave(key2);
    const i = notes.indexOf(a.note);
    const j = notes.indexOf(b.note);
    // if both octave and note are equal
    if (a.octave === b.octave && i === j) return 0;
    // if octave of a is less or the note is less
    else if (a.octave < b.octave || (a.octave === b.octave && i < j)) return -1;
    // otherwise a is greater
    else return 1;
  }

  /* Gets all the keys from start to end (both inclusive) */
  static getKeysInBetween(start: Key, end: Key): Key[] {
    if (KeyUtil.compare(start, end) > 0) return [];

    const keys = [start];
    while (KeyUtil.compare(start, end)) {
      start = KeyUtil.getNextKey(start);
      keys.push(start);
    }
    return keys;
  }

  static addShortcuts(keys: Key[]): Map<string, Key> {
    let [i, j, k] = [0, 0, 0];
    let naturalCount = 0;
    const shortcutToKeyMap = new Map();
    while (
      i < accidentalShortcuts.length &&
      j < naturalShortcuts.length &&
      k < keys.length
    ) {
      const key = keys[k];
      if (KeyUtil.getType(key) === 'accidental') {
        if (naturalCount !== 2 && j <= i) {
          shortcutToKeyMap.set(accidentalShortcuts[i], key);
          k++;
        }
        i++;
        naturalCount = 0;
      } else {
        shortcutToKeyMap.set(naturalShortcuts[j], key);
        k++;
        j++;
        naturalCount++;
      }
    }
    return shortcutToKeyMap;
  }
}

const notes = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;
