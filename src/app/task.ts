export class Task {
    constructor(
        public id: string,
        public name: string,
        public intervals: Object,
        public numberIntervals: number,
        public totalTime: number,
        public completed: boolean,
        public started: boolean
    ) { }
}
