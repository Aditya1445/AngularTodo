import { Injectable } from '@angular/core';
import { ToDo } from '../model/task.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  url = "http://localhost:3000/tasks";
  constructor(private http:HttpClient) { }

  addTask(task:ToDo){
    return this.http.post<ToDo>(this.url, task);
  }
  getTasks():Observable<ToDo[]>{
    return this.http.get<ToDo[]>(this.url);
  }
  deleteToDoTask(task:ToDo) {
    return this.http.delete<ToDo>(`${this.url}/${task.id}`);
  }
  deleteTaskInProgress(task:ToDo) {
    return this.http.delete<ToDo>(`${this.url}/${task.id}`);
  }
  deleteCompletedTask(task:ToDo) {
    return this.http.delete<ToDo>(`${this.url}/${task.id}`);
  }
  addInProgressTask(task:ToDo){
    return this.http.post<ToDo>(this.url, task);
  }
  updateTaskStatus(task: ToDo) {
    console.log('svc', task)
    return this.http.put<ToDo>(`${this.url}/${task.id}`, task);
  }
  updateTask(task:ToDo){
    return this.http.put<ToDo>(`${this.url}/${task.id}`, task);
  }
}
