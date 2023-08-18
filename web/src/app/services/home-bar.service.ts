import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeBarService {
  private selectedDataSubject = new BehaviorSubject<any>(null);
  selectedData$ = this.selectedDataSubject.asObservable();

  setSelectedData(data: any) {
    this.selectedDataSubject.next(data);
  }
}
