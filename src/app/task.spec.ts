import { Task } from './task';

describe('Task', () => {
  it('should create an instance', () => {
    expect(new Task(
      "task1",
      "Task 1",
      [{
        "id":"interval11",
        "name":"Interval 1",
        "shortBreak":5,
        "time":20,
        "completed":false,
        "removed":true
      }],
      1,
      20,
      false,
      false
    )).toBeTruthy();
  });
});
