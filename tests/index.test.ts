import { dummy } from "../src";

describe('dummy test', () => {
  test('some test', () => {
    expect(dummy(2)).toBe(4);
  });
});