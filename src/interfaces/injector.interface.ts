export interface Injector<T> {
  apply(dto?: unknown): Promise<T>;
}
