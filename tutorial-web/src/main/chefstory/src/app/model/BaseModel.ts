export abstract class BaseModel{
    id: number;
    title: string;
   _label: string;

   get label(): string {
     return this._label;
   }

}
