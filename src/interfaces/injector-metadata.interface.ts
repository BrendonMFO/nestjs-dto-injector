import { InjectorType } from './injector-type.interface';

export interface InjectorMetadata<T> {
  readonly property: string | symbol;
  readonly injectorType: InjectorType<T>;
}
