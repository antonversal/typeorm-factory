
export class FactoryAttribute<T> {
  private readonly attrValue: T

  constructor(value: T) {
    this.attrValue = value
  }

  public value(): T {
    return this.attrValue
  }

  public asyncValue(): T {
    return this.value()
  }
}
