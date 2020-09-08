export class Interval {
    constructor(
        public id: string,
        public name: string,
        public time: number,
        public shortBreak: number,
        public completed: boolean,
        public removed: boolean

    ) { }
}
