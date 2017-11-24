export type SequenceFunction<U> = (i: number) => U;

export class Sequence<T> {
  public readonly seqFunc: SequenceFunction<T>;

  protected lastNumber: number;

  constructor(seqFunc: SequenceFunction<T>) {
    this.lastNumber = 0;
    this.seqFunc = seqFunc;
  }

  public value(): T {
    this.lastNumber += 1;
    return this.seqFunc(this.lastNumber);
  }

  public asyncValue(): T {
    return this.value();
  }

  public clone() {
    return this;
  }
}
