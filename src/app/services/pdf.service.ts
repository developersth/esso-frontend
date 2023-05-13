import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = '/api/pdf';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/pdf' }),
    responseType: 'arraybuffer' as 'json'
  };

  constructor(private http: HttpClient) { }

  getPdf(): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(this.apiUrl, this.httpOptions);
  }
}
