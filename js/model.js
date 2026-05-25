export let model = {
    assignments: [],
    exam: 0,
    presenceInPercent: 0,
    standardAssignments: [100, 100, 105, 100, 100, 100, 100, 100],
    init: function () {
        this.assignments = [];
        this.exam = 0;
        this.presenceInPercent = 0;
    },
    getStandardAssignments: function () {
        return this.standardAssignments;
    },
    clearAssignments: function () {
        this.assignments = [];
    },
    addAssignmentResult: function (index, value) {
        this.assignments[index] = value;
    },
    addExamResult: function (value) {
        this.exam = value;
    },
    addPresencePercent: function (value) {
        this.presenceInPercent = value;
    },
    isPositive: function (value) {
        return value > 50;
    },
    calculateAssignmentPercent: function () {
        if (this.assignments.length === 0) return 0;
        const total = this.assignments.reduce((sum, a) => sum + a, 0) - this.findLowestGrade();
        return (total / ((this.assignments.length - 1) * 100)) * 100;
    },
    calculateGrade: function () {
        const assignmentPercent = this.calculateAssignmentPercent();
        const examPercent = this.exam;
        const positiveAssignments = this.assignments.filter(a => this.isPositive(a)).length;
        const minPositive = Math.ceil(this.assignments.length * 0.75);

        const failed =
            !this.isPositive(examPercent) ||
            this.presenceInPercent < 80 ||
            positiveAssignments < minPositive;

        return {
            examPercent,
            examGrade: this.getGrade(examPercent),
            assignmentPercent,
            assignmentGrade: this.getGrade(assignmentPercent),
            totalGrade: failed ? 5 : this.getGrade(examPercent * 0.4 + assignmentPercent * 0.6),
            failed,
            failReasons: {
                examFailed: !this.isPositive(examPercent),
                presenceFailed: this.presenceInPercent < 80,
                assignmentsFailed: positiveAssignments < minPositive,
            },
            lowestIndex: this.findLowestIndex(),
        };
    },
    findLowestGrade: function () {
        return Math.min(...this.assignments);
    },
    findLowestIndex: function () {
        let lowestIndex = 0;
        for (let i = 1; i < this.assignments.length; i++) {
            if (this.assignments[i] < this.assignments[lowestIndex]) lowestIndex = i;
        }
        return lowestIndex;
    },
    getGrade: function (value) {
        if (value > 86) return 1;
        else if (value > 74) return 2;
        else if (value > 61) return 3;
        else if (value > 50) return 4;
        else return 5;
    },
}