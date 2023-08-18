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

  getDataWithLimit(limit: number): Observable<any> {
    const url = `${this.baseUrl}/data?limit=${limit}`;
    return this.http.get(url);
  }

  getSondeList(): Observable<any> {
    const url = `${this.baseUrl}/sondes`;
    return this.http.get(url);
  }

  sseConnect(): Observable<any> {
    this.eventSource = new EventSource(`${this.baseUrl}/data-sse`);

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
