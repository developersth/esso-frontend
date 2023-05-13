import { th } from "date-fns/locale";
import { DatePipe } from "@angular/common";
export class Seal {
  public _id: string;
  public id: { increment: number };
  public sealNoItem: {
    some(arg0: (seal: any) => any): unknown; sealNo: string;
  }
  public sealBetween: string;
  public pack: number;
  public isUsed: boolean;
  public checked: boolean;
  public createAt: Date;
  public createAtSt: string;
  constructor() {
    this.id.increment = 0;
    this.sealBetween = '';
    this.pack = 0;
    this.isUsed = false;
    this.checked = false;
  }
}

export class SealOut {
  public _id: string;
  public id: { increment: number };
  public sealTotal: number;
  public sealTotalExtra: number;
  public truckLicense: boolean;
  public sealItem: {
    some(arg0: (seal: any) => any): unknown; sealNo: string, pack: number, type: string
  };
  public sealItemExtra: { sealNo: string, pack: number, type: string };
  public createAt: Date;
  public createAtSt: string;
  public checked: boolean;
}
