export const APPLY_INJECTOR_NESTED_KEY = Symbol(
  '__APPLY_INJECTOR_NESTED_KEY__',
);

export function ApplyInjectionNested(): PropertyDecorator {
  return (target, property): void => {
    const nestedInjector =
      Reflect.getMetadata(APPLY_INJECTOR_NESTED_KEY, target) || [];
    nestedInjector.push({ property });
    Reflect.defineMetadata(APPLY_INJECTOR_NESTED_KEY, nestedInjector, target);
  };
}
