import { effect } from '../effect';
import { reactive } from '../reactive';

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    // update
    user.age++;
    expect(nextAge).toBe(12);
  });

  it('should return runner when call effect', () => {
    // 1. effect(fn) => function (runner) => fn() => return fn result;
    let foo = 10;
    
    const runner = effect(() => {
      foo++;
      return 'foo';
    })

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe('foo');

  });

  it('scheduler', () => {
    /**
     * 1. 当effect第一次执行的时候，不会调用scheduler，只会执行fn
     * 2. 响应式对象发生变化时，不会执行fn，只会执行scheduler
     * 3. 执行scheduler时，会传入一个函数，执行这个函数相当于执行effect的fn
     * 4. 执行runner时，响应式对象会发生变化
     */

    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );  

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);

    run();
    // should have run
    expect(dummy).toBe(2);

  });
});