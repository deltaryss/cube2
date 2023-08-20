import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  private baseUrl = 'http://localhost:4321'; // Votre URL de base
  private eventSource!: EventSource;

  private dataSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  getData(limit: number = 10, idSonde?: number): Observable<any> {
    let url = `${this.baseUrl}/data?limit=${limit}`;

    if (idSonde !== undefined) {
      url += `&id_sonde=${idSonde}`;
    }

    return this.http.get(url);
  }

  getSondeList(): Observable<any> {
    const url = `${this.baseUrl}/sondes`;
    return this.http.get(url);
  }

  sseConnect(idSonde?: number): Observable<any> {
    let url = `${this.baseUrl}/data-sse`;

    if (idSonde !== undefined) {
      url += `?id_sonde=${idSonde}`;
    }

    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      this.dataSubject.next(JSON.parse(event.data));
    };

    return this.dataSubject.asObservable();
  }

  closeConnection() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
