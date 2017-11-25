import { getRepository, Repository } from "typeorm";
import { AssocManyAttribute } from "./AssocManyAttribute";
import { AssocOneAttribute } from "./AssocOneAttribute";
import { FactoryAttribute } from "./FactoryAttribute";
import { Sequence } from "./Sequence";

export interface IConstructable<T> {
  new(): T;
}

export type Attr<U> = [keyof U,
  Sequence<U[keyof U]> |
  AssocManyAttribute<any> |
  AssocOneAttribute<U[keyof U]> |
  FactoryAttribute<any>];

export type Attrs<U> = Array<Attr<U>>;

export class Factory<T> {
  public Obj: IConstructable<T>;
  public attrs: Attrs<T>;
  private privateRepository: Repository<T>;

  constructor(Obj: IConstructable<T>, attrs?: Attrs<T> ) {
    this.Obj = Obj;
    this.attrs = attrs || [];
  }

  private get repository() {
    this.privateRepository = this.privateRepository || getRepository(this.Obj);
    return this.privateRepository;
  }

  public clone(): Factory<T> {
    const clonedAttrs = this.attrs.map<Attr<T>>(([name, obj]) => [name, obj.clone()]);
    return new Factory<T>(this.Obj, clonedAttrs);
  }

  public sequence<K extends keyof T>(name: K, seqFunc: (i: number) => T[K]): Factory<T> {
    this.attrs.push([name, new Sequence<T[keyof T]>(seqFunc)]);
    return this;
  }

  public attr<K extends keyof T>(name: K, value: T[K]): Factory<T> {
    const clonedFactory = this.clone();
    clonedFactory.attrs.push([name, new FactoryAttribute<T[keyof T]>(value)]);
    return clonedFactory;
  }

  // here is any for factory attribute. Typescript does not understand T[K][0]
  public assocMany<K extends keyof T>(name: K, factory: Factory<any>, size: number = 1): Factory<T> {
    const clonedFactory = this.clone();
    clonedFactory.attrs.push([name, new AssocManyAttribute(factory, size)]);
    return clonedFactory;
  }

  public assocOne<K extends keyof T>(name: K, factory: Factory<T[K]>): Factory<T> {
    const clonedFactory = this.clone();
    clonedFactory.attrs.push([name, new AssocOneAttribute(factory)]);
    return clonedFactory;
  }

  public build(attributes: Partial<T> = {}): T {
    const ignoreKeys = Object.keys(attributes);
    const obj = this.assignAttrs(new this.Obj(), ignoreKeys);
    return this.repository.merge(obj, attributes as any);
  }

  public buildList(size: number): T[] {
    return Array.from({ length: size }, () => this.build());
  }

  public async create(attributes: Partial<T> = {}): Promise<T> {
    const ignoreKeys = Object.keys(attributes);
    const obj = await this.assignAsyncAttrs(new this.Obj(), ignoreKeys);
    const objWithAttrs = this.repository.merge(obj, attributes as any);
    return this.repository.save(objWithAttrs as any);
  }

  public async createList(size: number): Promise<T[]> {
    const objects = Array.from({ length: size }, () => this.create());
    const list = await Promise.all(objects);
    return list;
  }

  private assignAttrs(obj: T, ignoreKeys: string[]): T {
    return this.attrs.reduce((sum, [key, attribute]) => {
      if (ignoreKeys.indexOf(key) === -1) {
        sum[key] = attribute.value();
      }
      return sum;
    }, obj);
  }

  private assignAsyncAttrs(obj: T, ignoreKeys: string[]): Promise<T> {
    return this.attrs.reduce((sum, [key, factory]) => {
      return sum.then(async (s) => {
        if (ignoreKeys.indexOf(key) === -1) {
          s[key] = await factory.asyncValue();
        }
        return s;
      });
    }, Promise.resolve(obj));
  }
}
