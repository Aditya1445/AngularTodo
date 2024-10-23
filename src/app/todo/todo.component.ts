import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToDo } from '../shared/model/task.model';
import { CommonModule } from '@angular/common';
import { TaskService } from '../shared/services/task.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {

  todoForm!: FormGroup
  toDoList: ToDo[] = [];
  inProgressList: ToDo[] = [];
  completedList: ToDo[] = [];
  updateIndex!: number;
  isUpdateEnabled: boolean = false;

  constructor(private fb: FormBuilder, private taskSvc: TaskService) { }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      task: ['', [Validators.required, Validators.minLength(2)]]
    })
    this.loadTasks(); 
  }
  get taskControl(){
    return this.todoForm.get('task');
  }

  drop(event: CdkDragDrop<ToDo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const movedTask = event.container.data[event.currentIndex];
      console.log('Task status updated', movedTask, event)
      if (event.container.id === 'cdk-drop-list-0') {
        movedTask.status = 'todo';
      } else if (event.container.id === 'cdk-drop-list-1') {
        movedTask.status = 'in-progress';
      } else if (event.container.id === 'cdk-drop-list-2') {
        movedTask.status = 'completed';
      }
      this.taskSvc.updateTaskStatus(movedTask).subscribe((res:ToDo) => {
        console.log('Task status updated', res);
        this.loadTasks();
      });
    }
  }

  addTask() {
    const taskToSave = {
      description: this.todoForm.value.task,
      completed: false,
      status:'todo'
    }
    this.taskSvc.addTask(taskToSave).subscribe((r)=>{
      this.loadTasks();
    });
    this.todoForm.reset();
  }
  onEdit(index: number, item: ToDo) {
    this.todoForm.controls['task'].setValue(item.description);
    this.isUpdateEnabled = true;
    this.updateIndex = index;
  }
  updateTask() {
    const updatedTask: ToDo = {
      id:this.toDoList[this.updateIndex].id,
      description: this.todoForm.value.task,
      completed: this.toDoList[this.updateIndex].completed,
      status:this.toDoList[this.updateIndex].status
    }
    this.taskSvc.updateTask(updatedTask).subscribe((res:ToDo)=>{
      this.loadTasks();
      console.log('Task updated', res);
    })
    // this.toDoList[this.updateIndex] = updatedTask;

    this.updateIndex = -1;
    this.isUpdateEnabled = false;
    this.todoForm.reset();

  }
  deleteTask(index:number, task:ToDo) {
    this.toDoList.splice(index, 1);
    this.taskSvc.deleteToDoTask(task).subscribe((res)=>{
      this.loadTasks();
    })
  }
  deleteTaskInProgress(index: number, task:ToDo) {
    this.inProgressList.splice(index, 1);
    this.taskSvc.deleteTaskInProgress(task).subscribe((res)=>{
      this.loadTasks();
    })
  }
  deleteCompletedTask(index: number, task:ToDo) {
    this.completedList.splice(index, 1);
    this.taskSvc.deleteCompletedTask(task).subscribe((res)=>{
      this.loadTasks();
    })
  }

  loadTasks(){
    this.taskSvc.getTasks().subscribe((res:ToDo[])=>{
      this.toDoList = res.filter(task => task.status === 'todo');
      this.inProgressList = res.filter(task => task.status === 'in-progress');
      this.completedList = res.filter(task => task.status === 'completed');
    })
  }
}
