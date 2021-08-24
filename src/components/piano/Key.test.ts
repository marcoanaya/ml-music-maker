import { Key } from './Key';

test('getNoteAndOctave', () => {
  expect(Key.getNoteAndOctave('A1')).toMatchObject({ note: 'A', octave: 1 });
});

test('getType', () => {
  expect(Key.getType('F8')).toBe('natural');
  expect(Key.getType('F#8')).toBe('accidental');
});

test('getNextKey', () => {
  expect(Key.getNextKey('E8')).toBe('F8');
  expect(Key.getNextKey('B4')).toBe('C5');
});

test('compare', () => {
  const keys: Key.Str[] = ['A8', 'A8', 'A#7', 'C9', 'G#8'];
  expect(Key.compare(keys[0], keys[1])).toBe(0);
  expect(Key.compare(keys[2], keys[0])).toBe(-1);
  expect(Key.compare(keys[0], keys[2])).toBe(1);
  expect(Key.compare(keys[3], keys[0])).toBe(1);
  expect(Key.compare(keys[0], keys[4])).toBe(1);
});

test('getKeysInBetween', () => {
  expect(Key.getKeysInBetween('A8', 'A8')).toStrictEqual(['A8']);
  expect(Key.getKeysInBetween('A8', 'G#8')).toStrictEqual([]);
  expect(Key.getKeysInBetween('B8', 'C9')).toStrictEqual(['B8', 'C9']);
  expect(Key.getKeysInBetween('C1', 'B5').length).toBe(60);
});
