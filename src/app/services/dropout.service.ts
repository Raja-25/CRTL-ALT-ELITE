import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropoutService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getDropoutRiskData(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/dropout-risk`).pipe(
      map(response => response.data || [])
    );
  }

  sendNotification(): Observable<any> {
    return this.http.post(`${this.apiUrl}/sendnotification`, {});
  }
}