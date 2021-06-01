import { InjectorType } from "../interfaces/injector-type.interface";
import { InjectorMetadata } from "../interfaces/injector-metadata.interface";

export type InjectorMetadatas = Array<InjectorMetadata<unknown>>;

export const APPLY_INJECTOR_KEY = Symbol('__APPLY_INJECTOR_KEY__');

export function ApplyInjection<T>(injectorType: InjectorType<T>): PropertyDecorator {
  return (target, property): void => {
    const injectors: InjectorMetadatas =
      Reflect.getMetadata(APPLY_INJECTOR_KEY, target) || [];
    injectors.push({ injectorType, property });
    Reflect.defineMetadata(APPLY_INJECTOR_KEY, injectors, target);
  };
}
