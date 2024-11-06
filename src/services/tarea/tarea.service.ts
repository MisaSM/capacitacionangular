import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private apiUrl = 'https://localhost:44323/api/Tarea';
  constructor(private http: HttpClient) {}

  getTareas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getTareaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createTarea(tarea: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tarea);
  }

  updateTarea(id: number, tarea: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tarea);
  }

  deleteTarea(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  finishTarea(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/ToggleStatus/${id}`, {});
  }
}
