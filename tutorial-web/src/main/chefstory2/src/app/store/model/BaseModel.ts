export abstract class BaseModel{
  constructor(title: string) {
    this.title = title==null?"":title;
  }
    id: number;
    title: string;
   _label: string;
   modifiedTs:string;

   get label(): string {
     return this._label;
   }

  getTitle(t:BaseModel):string{
    let title=null;
    if(t.title!=null)
      title=t.title.trim();
    else if(t.label!=null)
      title=t.label.trim();
    else title=t;

    return title.trim();
  }

}
