import { isProxy, isReactive, reactive, readonly } from '../reactive'
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
  });

  test('nests reactive and readonly', () => {
    const original = {
      user: { age: 18 },
      arr: [{ name: 'lucy' }]
    }
    const observed = reactive(original)
    expect(isReactive(observed.user)).toBe(true)
    expect(isReactive(observed.arr[0])).toBe(true)
  });
  test('isProxy', () => {
    const original = { foo: 1 }
    const reactiveObj = reactive(original)
    const readonlyObj = readonly(original)
    expect(isProxy(reactiveObj)).toBe(true)
    expect(isProxy(readonlyObj)).toBe(true)
  });

});