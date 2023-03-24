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

it('scheduler', () => {
  let dummy
  let run: any
  const scheduler = jest.fn(() => {
    run = runner
  })
  const obj = reactive({ foo: 1 })
  const runner = effect(() => {
    dummy = obj.foo
  },
    { scheduler }
  )
  expect(scheduler).not.toHaveBeenCalled()
  expect(dummy).toBe(1)
  obj.foo++
  expect(scheduler).toHaveBeenCalledTimes(1)
  expect(dummy).toBe(1)
  run()
  expect(dummy).toBe(2)
});