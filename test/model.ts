export class Model {
  public user?: User;
}

export class User {
  public id: number;
  public id2?: number;
  public name?: string;
  public links?: string[];
  public b?: boolean;
  public birth?: Date;

  public constructor(id: number) {
    this.id = id;
  }
}

export interface MyMap {
  [key: string]: string | null;
}
