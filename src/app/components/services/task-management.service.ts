import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TaskManagement } from '../interfaces/task-management';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  http = inject(HttpClient);

  getTasks(): Observable<TaskManagement[]> {
    return this.http.get<TaskManagement[]>(`https://apitareas-caf7b7fqgmg6dwf3.canadacentral-01.azurewebsites.net/api/Tasks`);
  }

  saveTask(task: TaskManagement): Observable<any> {
    return this.http.post<any>(`https://apitareas-caf7b7fqgmg6dwf3.canadacentral-01.azurewebsites.net/api/Tasks`, task);
  }

  updateTask(task: TaskManagement): Observable<{message: string, data: TaskManagement}> {
    return this.http.put<{message: string, data: TaskManagement}>(`https://apitareas-caf7b7fqgmg6dwf3.canadacentral-01.azurewebsites.net/api/Tasks/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`https://apitareas-caf7b7fqgmg6dwf3.canadacentral-01.azurewebsites.net/api/Tasks/${id}`);
  }
}
