export class Category {
  id: number;
  title: string;
  type: string;

  private _label: string;

  get label(): string {
    return this._label;
  }


}
