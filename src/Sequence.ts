export type SequenceFunction<U> = (i: number) => U;

export class Sequence<T> {
  public readonly sequenceFunction: SequenceFunction<T>;

  protected lastNumber: number;

  constructor(sequenceFunction: SequenceFunction<T>) {
    this.lastNumber = 0;
    this.sequenceFunction = sequenceFunction;
  }

  public value(): T {
    this.lastNumber += 1;
    return this.sequenceFunction(this.lastNumber);
  }

  public asyncValue(): T {
    return this.value();
  }

  public clone() {
    return this;
  }
}
