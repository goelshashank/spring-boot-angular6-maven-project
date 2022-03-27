export class Brand {
  id: number;
  title: string;
  private _label: string;

  get label(): string {
    return this._label;
  }
}
