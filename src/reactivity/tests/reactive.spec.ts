import { reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = reactive(original);

    // 1. observed ！== original
    expect(observed).not.toBe(original);

    // 2. observed.foo === original.foo
    expect(observed.foo).toBe(1);
  })
});