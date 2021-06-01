export interface Injector<T> {
  apply(dto?: any): Promise<T>;
}
