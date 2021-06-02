import { Injector } from './injector.interface';

export interface InjectorType<T> {
  new (...args: unknown[]): Injector<T>;
}
