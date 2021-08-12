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

export class Key {
  note: Key.Note;
  octave: number;
  shortcut?: string;

  constructor(val: Key.Str) {
    const [, note, octave] = val.match(/([A-G][#]?)([1-9])/)!;
    this.note = note as Key.Note;
    this.octave = Number(octave);
  }

  /* Gets the 'type' of the key, i.e. in a piano black (accidental) or white (natural) */
  getType(): Key.Type {
    return this.note.length > 1 ? 'accidental' : 'natural';
  }

  /* Gets the next (higher) key */
  getNextKey(): Key {
    const i = (notes.indexOf(this.note) + 1) % notes.length;
    return new Key(`${notes[i]}${this.octave + Number(i === 0)}`);
  }

  /* Converts key to string */
  toString(): Key.Str {
    return `${this.note}${this.octave}`;
  }

  /* Compares key a to key b. Returns:
   *   -1 if a < b
   *    0 if a = b
   *    1 if a > b
   */
  static compare(a: Key, b: Key): number {
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
  static getKeysInBetween(start: Key.Str, end: Key.Str): Key[] {
    let startKey = new Key(start);
    const endKey = new Key(end);

    if (Key.compare(startKey, endKey) > 0) return [];

    const keys = [startKey];
    while (Key.compare(startKey, endKey)) {
      startKey = startKey.getNextKey();
      keys.push(startKey);
    }

    return keys;
  }

  static addShortcuts(keys: Key[]): Map<string, Key> {
    const accidentalShortcuts = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '-',
      '=',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      ';',
      "'",
      /*'!',*/ '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '_',
      '+',
      'A',
      'S',
      'D',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      ':',
    ];
    const naturalShortcuts = [
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      '[',
      ']',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      ',',
      '.',
      '/',
      'Q',
      'W',
      'E',
      'R',
      'T',
      'Y',
      'U',
      'I',
      'O',
      'P',
      '{',
      '}',
      'Z',
      'X',
      'C',
      'V',
      'B',
      'N',
      'M',
      '<',
      '>',
      '?',
    ];
    let [i, j, k] = [0, 0, 0];
    let naturalCount = 0;
    const shortcutToKeyMap = new Map();
    while (
      i < accidentalShortcuts.length &&
      j < naturalShortcuts.length &&
      k < keys.length
    ) {
      const key = keys[k];
      if (key.getType() === 'accidental') {
        if (naturalCount !== 2 && j <= i) {
          key.shortcut = accidentalShortcuts[i];
          shortcutToKeyMap.set(accidentalShortcuts[i], key);
          k++;
        }
        i++;
        naturalCount = 0;
      } else {
        key.shortcut = naturalShortcuts[j];
        shortcutToKeyMap.set(naturalShortcuts[j], key);
        k++;
        j++;
        naturalCount++;
      }
    }
    return shortcutToKeyMap;
  }
}

export declare namespace Key {
  export type Note = typeof notes[number];
  export type Type = 'accidental' | 'natural';
  export type Str = `${Key.Note}${number}`;
}
