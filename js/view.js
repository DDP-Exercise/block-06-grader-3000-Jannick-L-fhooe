export let view = {
    init: function (assignmentMaximums) {
        document.body.innerHTML = "";
        const main = document.createElement("main");
        main.className = "container";

        const header = document.createElement("header");
        header.className = "header";
        const h1 = document.createElement("h1");
        h1.className = "title";
        h1.textContent = "Grader 3000";
        header.append(h1);

        const form = document.createElement("form");
        form.className = "form";

        const inputSection = document.createElement("section");
        inputSection.className = "input-section";

        const inputSectionTitle = document.createElement("h2");
        inputSectionTitle.className = "section-title";
        inputSectionTitle.textContent = "Hausübungen";

        const inputList = document.createElement("div");
        inputList.className = "input-list";

        for (let max of assignmentMaximums) inputList.append(this.createInput(max));

        const addRow = document.createElement("div");
        addRow.className = "add-row";

        const maxInput = document.createElement("input");
        maxInput.type = "number";
        maxInput.placeholder = "Max Punkte";
        maxInput.min = "1";
        maxInput.max = "1000";
        maxInput.step = "1";
        maxInput.className = "max-input";

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "add";
        addBtn.textContent = "Hausuebung hinzufuegen";

        addRow.append(maxInput, addBtn);
        inputSection.append(inputSectionTitle, inputList, addRow);

        const extraSection = document.createElement("section");
        extraSection.className = "extra-section";

        const extraSectionTitle = document.createElement("h2");
        extraSectionTitle.className = "section-title";
        extraSectionTitle.textContent = "Klausur und Anwesenheit";

        const extraGrid = document.createElement("div");
        extraGrid.className = "extra-grid";

        const examInput = document.createElement("input");
        examInput.type = "number";
        examInput.min = "0";
        examInput.step = "1";
        examInput.max = "100";
        examInput.placeholder = "Klausur";
        examInput.className = "exam-input";

        const presenceInput = document.createElement("input");
        presenceInput.type = "number";
        presenceInput.min = "0";
        presenceInput.step = "1";
        presenceInput.max = "100";
        presenceInput.placeholder = "Anwesenheit";
        presenceInput.className = "presence-input";

        extraGrid.append(examInput, presenceInput);
        extraSection.append(extraSectionTitle, extraGrid);

        const clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "clear";
        clearBtn.textContent = "Zurücksetzen";
        extraSection.append(clearBtn)

        const resultSection = document.createElement("section");
        resultSection.className = "result-section";

        const resultTitle = document.createElement("h2");
        resultTitle.className = "section-title";
        resultTitle.textContent = "Ergebnis";

        const resultGrid = document.createElement("div");
        resultGrid.className = "result-grid";

        const assignmentResult = document.createElement("div");
        assignmentResult.className = "result-item";
        assignmentResult.id = "result-assignments";

        const examResult = document.createElement("div");
        examResult.className = "result-item";
        examResult.id = "result-exam";

        const totalResult = document.createElement("div");
        totalResult.className = "result-item result-total";
        totalResult.id = "result-total";

        const reasonBox = document.createElement("div");
        reasonBox.className = "reason-box hidden";
        reasonBox.id = "reason-box";

        resultGrid.append(assignmentResult, examResult, totalResult);
        resultSection.append(resultTitle, resultGrid, reasonBox);

        form.append(inputSection, extraSection, resultSection);
        main.append(header, form);

        document.body.append(main);
    },
    createInput: function (max = 100) {
        const row = document.createElement("div");
        row.className = "input-row";

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.max = String(max);
        input.placeholder = "0 - " + max + " Punkte";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove";
        removeBtn.textContent = "×";

        row.append(input, removeBtn);
        return row;
    },
    markLowest: function (lowestIndex) {
        const rows = document.querySelectorAll(".input-row");
        rows.forEach((row, i) => row.classList.toggle("striked", i === lowestIndex));
    },
    markNegative: function (failReasons) {
        document.querySelector(".exam-input").classList.toggle("negative", failReasons.examFailed);
        document.querySelector(".presence-input").classList.toggle("negative", failReasons.presenceFailed);

        const reasonBox = document.getElementById("reason-box");
        const reasons = [];
        if (failReasons.examFailed) reasons.push("Klausur nicht positiv");
        if (failReasons.presenceFailed) reasons.push("Anwesenheit unter 80%");
        if (failReasons.assignmentsFailed) reasons.push("Zu wenige Übungen positiv");
        reasonBox.textContent = reasons.join(" · ");
        reasonBox.classList.toggle("hidden", reasons.length === 0);
    },
    renderResult: function (grade) {
        document.getElementById("result-assignments").textContent =
            "Übungsnote: " + grade.assignmentGrade + " (" + Math.round(grade.assignmentPercent) + "%)";
        document.getElementById("result-exam").textContent =
            "Klausurnote: " + grade.examGrade + " (" + Math.round(grade.examPercent) + "%)";
        document.getElementById("result-total").textContent =
            "Gesamtnote: " + grade.totalGrade;
        document.getElementById("result-total").classList.toggle("negative", grade.failed);

        this.markLowest(grade.lowestIndex);
        this.markNegative(grade.failReasons);
    },
}