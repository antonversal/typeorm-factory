import { Factory } from './Factory';

export class AssocOneAttribute<T> {
  private readonly factory: Factory<T>;

  constructor(factory: Factory<T>) {
    this.factory = factory;
  }

  public value(): T {
    return this.factory.build();
  }

  public asyncValue(): Promise<T> {
    return this.factory.create();
  }

  public clone() {
    return new AssocOneAttribute<T>(this.factory);
  }
}
