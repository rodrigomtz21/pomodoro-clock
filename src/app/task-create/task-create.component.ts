import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task';
import { Interval } from '../interval';
import { interval, fromEvent, merge, empty } from 'rxjs';
import { takeWhile, switchMap, scan, startWith, mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {
  numberIntervals: number;
  taskNumber: number;
  nameTask: string;
  tasks: Array<object>;
  intervals: Array<object>;
  timer: any;
  minutes:number;
  breakInProgress: boolean;
  myObserver: any;
  subscription: any;
  titleInterval: string;
  taskRunning: boolean;
  selectedTask:Task;
  editing: boolean;
  taskForm: boolean;
  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.numberIntervals = 1;
    this.taskNumber = 1;
    this.nameTask = "";
    this.tasks = [];
    this.minutes = 0;
    this.timer = 0;
    this.breakInProgress= false;
    this.taskRunning = false;
    this.editing = false;
    this.taskForm = false;
    this.addInterval(false);

  }

  addToList() {
    const totalTime = this.intervals.reduce((total:number, item:Interval) => {
      return total += item.time; 
    },0);
    let task = new Task(
      'task'+this.taskNumber,
      this.nameTask,
      this.intervals,
      Object.keys(this.intervals).length,
      totalTime,
      false,
      false
    );
    this.taskService.addToList(task);
    this.tasks = this.taskService.getTasks();
    this.nameTask = "";
    
    this.taskNumber++;
    this.numberIntervals = 1;
    this.taskService.clearIntervals();
    this.addInterval(false);

    this.taskForm = false;
    

  }

  addIntervalToTask() {
    this.numberIntervals++;
    this.addInterval();
  }

  addInterval(removed = true){
    this.taskService.addInterval(
      new Interval(
        "interval"+this.taskNumber+this.numberIntervals,
        "Interval "+this.numberIntervals,
        0,
        5,
        false,
        removed
      )
    );
    this.intervals = this.taskService.getIntervals();
  }
  startInterval(id) {
    let interval = this.taskService.getUncompletedInterval(id);
    if(interval) {
      this.taskService.changeStatusStartedTask(id, true);
      this.tasks = this.taskService.getTasks();
      
      this.taskRunning = true;
      this.minutes = interval.time;
      this.titleInterval = interval.name;
      this.oberserableTimer(interval, id);
    }else{
      this.taskRunning = false;
      this.taskService.changeStatusTask(id);
      this.taskService.changeStatusStartedTask(id, false);
      this.subscription.unsubscribe();
      this.tasks = this.taskService.getTasks();
    }
  }
  stopInterval(id) {
    this.taskRunning = false;
    this.taskService.changeStatusStartedTask(id, false);
    this.subscription.unsubscribe();
    this.tasks = this.taskService.getTasks();
  }
  oberserableTimer(intervalProp, id) {

    const COUNTDOWN_SECONDS = -1;

    const pauseButton =  document.getElementById('pauseBtn'+id);
    const resumeButton =  document.getElementById('resumeBtn'+id);

    const intervals = interval(1000).pipe(mapTo(-1));
    const pause = fromEvent(pauseButton, 'click').pipe(mapTo(false));
    const resume = fromEvent(resumeButton, 'click').pipe(mapTo(true));

    const timer = merge(pause, resume)
                  .pipe(
                    startWith(true),
                    switchMap(val => (val ? intervals : empty())),
                    scan((acc, curr) => (curr ? acc - curr : acc), COUNTDOWN_SECONDS),
                    takeWhile(val => val <= 59)
                  )
    this.myObserver = {
      next: x => {
        this.timer=59-x;
        if(x == 0)
          this.minutes--;
      },  
      error: err => console.error('Observer got an error: ' + err),
      complete: () => {
        if(this.minutes !== 0){
          this.oberserableTimer(intervalProp, id);
        }else{
          console.log('Observer got a complete notification 00:00')
          if(intervalProp.shortBreak !== 0 && this.breakInProgress == false){
            alert("Break will start!");
            this.breakInProgress = true;
            this.titleInterval = "Break";
            this.minutes = intervalProp.shortBreak;
            this.oberserableTimer(intervalProp, id);
          }else{
            console.log('Interval Completed!');
            this.taskService.changeStatusInterval(id, intervalProp.id);
            this.breakInProgress = false;
            this.startInterval(id);
          }
        }
        
      }
    };
    this.subscription = timer.subscribe(this.myObserver);
  }

  removeTaskFromList(id) {
    this.taskService.removeTask(id);
    this.tasks = this.taskService.getTasks();
  }

  removeInterval(id) {
    this.taskService.removeInterval(id);
    this.intervals = this.taskService.getIntervals();
  }

  endTask(id){
    this.taskService.changeStatusTask(id);
  }

  editTask(id) {
    this.editing = true;
    this.taskForm = true;
    this.selectedTask = this.taskService.getTaskById(id);
    this.taskService.setIntervals(this.selectedTask.intervals);
    
    this.intervals = this.taskService.getIntervals();
    this.nameTask = this.selectedTask.name;
  
    
  }
  updateTask(){
    const totalTime = this.intervals.reduce((total:number, item:Interval) => {
      return total += item.time; 
    },0);
    let newTask = new Task(
      this.selectedTask.id,
      this.nameTask,
      this.intervals,
      Object.keys(this.intervals).length,
      totalTime,
      false,
      false
    );
    this.taskService.updateTask(newTask);
    this.editing = false;
    this.tasks = this.taskService.getTasks();
    this.nameTask = "";
    
    this.taskNumber++;
    this.numberIntervals = 1;
    this.taskService.clearIntervals();
    this.addInterval(false);
    this.taskForm = false;
  }
  openTaskForm(){
    this.taskForm = true;
  } 
  closeTaskForm() {
    this.taskForm = false;
    this.nameTask = "";
    this.intervals = [];
    this.taskService.setIntervals(this.intervals);
    this.editing = false;
    this.selectedTask = null;
    this.addInterval(false);
  }
}
