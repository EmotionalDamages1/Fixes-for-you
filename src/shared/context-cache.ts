export class ContextCache<T> {
  private readonly cache = new Map<string, T>();

  get(key: unknown): T | undefined {
    return this.cache.get(JSON.stringify(key));
  }

  set(key: unknown, value: T): void {
    this.cache.set(JSON.stringify(key), value);
  }
}
