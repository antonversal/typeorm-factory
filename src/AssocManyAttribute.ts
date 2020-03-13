import { Factory } from './Factory';

export class AssocManyAttribute<T> {
  private readonly factory: Factory<T>;
  private readonly size: number;

  constructor(factory: Factory<T>, size: number = 1) {
    this.factory = factory;
    this.size = size;
  }

  public value() {
    return this.factory.buildList(this.size);
  }

  public asyncValue() {
    return this.factory.createList(this.size);
  }

  public clone() {
    return new AssocManyAttribute<T>(this.factory, this.size);
  }
}
