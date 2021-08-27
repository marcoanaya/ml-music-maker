import Key, { KeyUtil } from './Key';

test('getNoteAndOctave', () => {
  expect(KeyUtil.getNoteAndOctave('A1')).toMatchObject({
    note: 'A',
    octave: 1,
  });
});

test('getType', () => {
  expect(KeyUtil.getType('F8')).toBe('natural');
  expect(KeyUtil.getType('F#8')).toBe('accidental');
});

test('getNextKey', () => {
  expect(KeyUtil.getNextKey('E8')).toBe('F8');
  expect(KeyUtil.getNextKey('B4')).toBe('C5');
});

test('compare', () => {
  const keys: Key[] = ['A8', 'A8', 'A#7', 'C9', 'G#8'];
  expect(KeyUtil.compare(keys[0], keys[1])).toBe(0);
  expect(KeyUtil.compare(keys[2], keys[0])).toBe(-1);
  expect(KeyUtil.compare(keys[0], keys[2])).toBe(1);
  expect(KeyUtil.compare(keys[3], keys[0])).toBe(1);
  expect(KeyUtil.compare(keys[0], keys[4])).toBe(1);
});

test('getKeysInBetween', () => {
  expect(KeyUtil.getKeysInBetween('A8', 'A8')).toStrictEqual(['A8']);
  expect(KeyUtil.getKeysInBetween('A8', 'G#8')).toStrictEqual([]);
  expect(KeyUtil.getKeysInBetween('B8', 'C9')).toStrictEqual(['B8', 'C9']);
  expect(KeyUtil.getKeysInBetween('C1', 'B5').length).toBe(60);
});
