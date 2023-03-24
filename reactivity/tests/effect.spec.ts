import { effect } from '../effect';
import { reactive } from '../reactive'
describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 1 })
    let newAge
    effect(() => {
      newAge = user.age + 1
    })
    expect(newAge).toBe(2)
    user.age++
    expect(newAge).toBe(3)
  });

  it('should return runner when effect is called', () => {
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    runner()
    expect(foo).toBe(12)
    expect(runner()).toBe('foo')

  });
});