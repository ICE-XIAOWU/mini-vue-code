class ReactiveEffect {
  private _fn: Function
 
  constructor(fn) {
    this._fn = fn
  }
  run() {
    // 1. 保存当前的effect
    activeEffect = this;

    // 2. 执行fn
    return this._fn();
  }
}

const targetMap = new WeakMap();
// 依赖收集
export function tract(target, key) {
  // 依赖关系： depsMap -> deps(Set) -> effect
  let depsMap = targetMap.get(target);
  if(!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  // deps
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  // effect
  deps.add(activeEffect);
}

// 触发依赖
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);

  for (const effect of deps) {
    effect.run();
  }
}

let activeEffect;
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);

  // 1. 进来先执行一次
  _effect.run();

  // 2. 返回runner
  return _effect.run.bind(_effect);
}