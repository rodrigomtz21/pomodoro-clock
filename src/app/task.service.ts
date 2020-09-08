import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks = [];
  intervals = [];

  constructor() { }

  addToList(task){
    this.tasks = [
      ...this.tasks,
      task
    ]
  }
  addInterval(interval) {
    this.intervals = [
      ...this.intervals,
      interval
    ]
  }

  getTasks(){
    return this.tasks;
  }

  getIntervals(){
    return this.intervals;
  }

  clearIntervals(){
    this.intervals = [];
  }

  getUncompletedInterval(id) {
    let task = this.tasks.find(task => task.id == id);
    return task.intervals.find(interval => interval.completed == false);

  }

  changeStatusInterval(idTask, idInterval) {
    this.tasks.map(task => {
      if(task.id == idTask){
        task.intervals.map(interval => {
          if(interval.id == idInterval){
            interval.completed = true;
          }
        })
      }
    });

  }
  changeStatusTask(id){
    this.tasks.map(task => {
      if(task.id == id){
        task.completed = true;
      }
    })
  }

  changeStatusStartedTask(id, state){
    this.tasks.map(task => {
      if(task.id == id){
        task.started = state;
      }
    })
  }

  removeTask(id){
    const tasks = this.tasks;
    this.tasks = tasks.filter(item => item.id !== id);
  }

  removeInterval(id){
    const intervals = this.intervals;
    this.intervals = intervals.filter(item => item.id !== id);
  }

  getTaskById(id){
    let byTask;
    this.tasks.map(task => {
      if(task.id == id){
        byTask = task;
      }
    });
    return byTask;
  }

  setIntervals(intervals){
    this.intervals = intervals;
  }

  updateTask(task){
    this.tasks.map(item => {
      if(item.id == task.id){
        Object.assign(item, task);
      }
    })
      

  }
}
