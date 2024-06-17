import {BaseModel} from "./BaseModel";

export class Category extends BaseModel{
  constructor(title:string,type:string,isSub: boolean) {
    super(title);
    this.type=type;
    this.isSub = isSub;
  }

  type: string;
  isSub: boolean;



}
