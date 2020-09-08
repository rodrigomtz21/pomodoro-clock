import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreateComponent } from './task-create.component';
import { Task } from '../task';
import { Interval } from '../interval';
import { TaskService } from '../task.service';
describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let taskService: TaskService;
  let intervalsFixture = [
    {
      "id":"intervaaal11",
      "name":"Interval 1",
      "shortBreak":5,
      "time":20,
      "completed":false,
      "removed":true
    }
  ]
  let interval = new Interval(
    "interval11",
    "Interval 1",
    0,
    5,
    false,
    false
  )
  let task = new Task(
    "task1",
    "Task 1",
    intervalsFixture,
    1,
    20,
    false,
    false
  );
  let editedTask = new Task(
    "task1",
    "New edited name",
    intervalsFixture,
    1,
    20,
    false,
    false
  );
  let startedTask = new Task(
    "task1",
    "Task 1",
    intervalsFixture,
    1,
    20,
    false,
    true
  );
   
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should add task to list", () => {
    let taskAdd = new Task(
      "task1",
      "Task 1",
      intervalsFixture,
      1,
      20,
      false,
      false
    );
    component.taskNumber = 1;
    component.nameTask = "Task 1";
    component.intervals = intervalsFixture;

    component.addToList();
    
    expect(component.tasks).toEqual([taskAdd])

  });

  it("should add interval to list", () => {
    component.taskNumber = 1;
    component.numberIntervals = 1;
    component.addInterval(false);

    expect(component.intervals).toEqual([interval, interval]);
  });

  it("should start an interval", () => {
    taskService.addToList(task);
    component.startInterval(task.id);
    
    expect(component.titleInterval).toEqual("Interval 1");
  });

  xit("should stop an interval", () => {
    taskService.addToList(startedTask);
    component.startInterval(task.id);
    component.stopInterval(task.id);
    
    expect(component.tasks).toEqual([task]);
  });

  it("should remove task from list", () => {
    taskService.addToList(task);

    component.removeTaskFromList(task.id);
    
    expect(component.tasks).toEqual([]);
  });

  it("should remove interval from list", () => {
    taskService.addInterval(interval);

    component.removeInterval(interval.id);
    
    expect(component.intervals).toEqual([]);
  });

  it("should edit taskt", () => {
    taskService.addToList(task);

    component.editTask(task.id);
    
    expect(component.nameTask).toEqual("Task 1");
  });

  it("should update a taskt", () => {
    taskService.addToList(task);

    component.editTask(task.id);
    component.nameTask = "New edited name";
    component.updateTask();
    expect(component.tasks).toEqual([editedTask]);
    //component.nameTask = "";
  });

  it("should open form", () => {
    component.openTaskForm();
    
    expect(component.taskForm).toEqual(true);
  });

  it("should close form", () => {
    component.closeTaskForm();
    
    expect(component.taskForm).toEqual(false);
  });

});
