import { Injectable } from "@angular/core";

import { Observable, of, forkJoin } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { forEach } from "core-js/core/array";

//----------------------------------------------------------------
import { Seal } from "../models/seal.model";
import { User } from "../models/user.model";
import { Truck } from "../models/truck.model";
import { Response } from "../models/response.model";

const headers = new HttpHeaders().set("Content-Type", "application/json");
@Injectable()
export class RestService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = `${environment.apiUrl}`;
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/pdf" }),
    responseType: "arraybuffer" as "json",
  };
  //----------------------------------------------------------------
  private sealInUrl = `${this.apiUrl}/sealin`;
  private sealItemUrl = `${this.apiUrl}/SealItem`;
  private sealOutUrl = `${this.apiUrl}/sealout`;
  private userUrl = `${this.apiUrl}/user`;
  private truckUrl = `${this.apiUrl}/truck`;

  //----------------------------------------------------------------
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userUrl}`);
  }
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }
  createUser(body: any): Observable<User> {
    return this.http.post<User>(`${this.userUrl}`, body);
  }
  updateUser(id: string, body: any): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/${id}`, body);
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/user/${id}`);
  }
  //----------------------------------------------------------------
  getTruck(): Observable<Truck[]> {
    return this.http.get<Truck[]>(this.truckUrl);
  }
  getTruckById(id: string): Observable<Truck[]> {
    return this.http.get<Truck[]>(`${this.truckUrl}/${id}`);
  }
  addTruck(truck: Truck): Observable<Response> {
    return this.http.post<Response>(`${this.truckUrl}`, truck);
  }
  updateTruck(id: string, truck: Truck): Observable<Truck> {
    return this.http.put<Truck>(`${this.truckUrl}/${id}`, truck);
  }
  deleteTruck(id: string): Observable<any> {
    return this.http.delete(`${this.truckUrl}/${id}`);
  }
  //----------------------------------------------------------------
  addSeal(items: any): Observable<any> {
    let item = JSON.stringify(items);
    return this.http.post<any>(`${this.sealInUrl}`, item, { headers });
  }
  getSeal(
    isActive: string,
    columnSearch: string,
    searchTerm: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const body = { startDate: startDate, endDate: endDate };
    return this.http.get<any[]>(
      `${this.sealInUrl}?pIsActive=${isActive}&pColumnSearch=${columnSearch}&searchTerm=${searchTerm}&pStartDate=${startDate}&pEndDate=${endDate}`,
      { headers }
    );
  }
  getSeaBetWeen(): Observable<any> {
    return this.http.get<any[]>(`${this.sealInUrl}/GetSealBetWeen`, {
      headers,
    });
  }
  deleteSeal(id: string): Observable<any> {
    return this.http.delete<any[]>(`${this.sealInUrl}/${id}`, { headers });
  }
  deleteSealAll(itemId: string[]): Observable<any> {
    const deleteRequests = itemId.map((itemId) => this.deleteSeal(itemId));
    return forkJoin(deleteRequests);
  }
  //----------------------------------------------------------------
  getSealItemBySealInId(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.sealItemUrl}/BySealInId/${id}`, {
      headers,
    });
  }
  //----------------------------------------------------------------
  deleteSealOut(id: string): Observable<any> {
    return this.http.delete<any[]>(`${this.sealOutUrl}/${id}`, { headers });
  }
  addSealOut(item: any): Observable<any> {
    return this.http.post<any>(`${this.sealOutUrl}`, item, {
      headers,
    });
  }
  updateSealOut(id: string, item: any): Observable<any> {
    return this.http.put<any>(`${this.sealOutUrl}/${id}`, item, {
      headers,
    });
  }
  getSealOutById(id: string): Observable<any> {
    return this.http.get<any[]>(`${this.sealOutUrl}/${id}`, { headers });
  }
  getReportReceipt(id: string): Observable<any> {
    return this.http.get<any[]>(`${this.sealOutUrl}/showreceipt`, { headers });
  }
  getSealOutAll(
    isCancel: string,
    columnSearch: string,
    searchTerm: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const body = { startDate: startDate, endDate: endDate };
    return this.http.get<any[]>(
      `${this.sealOutUrl}?pIsActive=${isCancel}&pColumnSearch=${columnSearch}&searchTerm=${searchTerm}&pStartDate=${startDate}&pEndDate=${endDate}`,
      {
        headers,
      }
    );
  }
}
