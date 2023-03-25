import { readonly } from "../reactive";

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = readonly(original)
    expect(observed.foo).toBe(1)
  });
  it('warn when set is called', () => {
    console.warn = jest.fn()
    const user = readonly({ age: 19 })
    user.age++
    expect(console.warn).toBeCalled()
  });
});