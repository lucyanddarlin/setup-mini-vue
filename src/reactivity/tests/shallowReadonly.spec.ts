import { isReadonly, shallowReadonly } from "../reactive";

describe('shallowReadonly', () => {
  it('happy path', () => {
    const original = { user: { age: 19 } }
    const observed = shallowReadonly(original)
    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.user)).toBe(false)
  });
  it('warn when set is called', () => {
    console.warn = jest.fn()
    const user = shallowReadonly({ age: 19 })
    user.age++
    expect(console.warn).toBeCalled()
  });
});