const notes = ["C", "C#", "D", "D#", "E" , "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export class Key {
  note: Key.Note;
  octave: number;
  
  constructor(val: Key.Str) {
    const [, note, octave] = val.match(/([A-G][#]?)([1-9])/)!
    this.note = note as Key.Note;
    this.octave = Number(octave);
  }

  /* Gets the 'type' of the key, i.e. in a piano black (accidental) or white (natural) */
  getType(): Key.Type {
    return (this.note.length > 1)? "accidental" : "natural";
  }

  /* Gets the next (higher) key */
  getNextKey(): Key {
    const i = (notes.indexOf(this.note) + 1) % notes.length;
    return new Key(`${notes[i]}${this.octave + Number(i === 0)}`)
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
    else return 1
  }

  /* Gets all the keys from start to end (both inclusive) */
  static getKeysInBetween(
    start: Key.Str,
    end: Key.Str,
  ): Key[] {

    let [startKey, endKey] = [new Key(start), new Key(end)]
    
    if (Key.compare(startKey, endKey) > 0)
      return []

    const keys = [startKey];
    while (Key.compare(startKey, endKey)) {
      startKey = startKey.getNextKey();
      keys.push(startKey);
    }
    return keys;
  }
}

export declare namespace Key {
  export type Note = typeof notes[number];
  export type Type = ("accidental" | "natural");
  export type Str = `${Key.Note}${number}`;
}
