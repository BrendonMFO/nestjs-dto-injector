import { Injector } from './injector.interface';

export interface InjectorType<T> {
  new (): Injector<T>;
}
