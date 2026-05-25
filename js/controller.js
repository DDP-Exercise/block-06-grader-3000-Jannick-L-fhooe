import {view} from "./view.js"
import {model} from "./model.js"

export let controller = {
    init: function () {
        model.init();
        view.init(model.getStandardAssignments());

        document.addEventListener("blur", (e) => {
            if (e.target.tagName !== "INPUT" || e.target.type !== "number") return;
            if (+e.target.value > +e.target.max) e.target.value = e.target.max;
            if (+e.target.value < +e.target.min) e.target.value = e.target.min;
            this.recalculate();
        }, true);

        document.addEventListener("click", (e) => {
            if (!e.target.classList.contains("remove")) return;
            e.target.closest(".input-row").remove();
            this.recalculate();
        });

        document.addEventListener("click", (e) => {
            if (!e.target.classList.contains("add")) return;
            const maxInput = document.querySelector(".max-input");
            const location = document.querySelector(".input-list");
            if (maxInput.value !== "") location.append(view.createInput(maxInput.value));
            maxInput.value = "";
            this.recalculate();
        });

        document.addEventListener("gradeChanged", (e) => {
            view.renderResult(e.detail);
        });
        document.addEventListener("click", (e) => {
            if (!e.target.classList.contains("clear")) return;
            document.querySelectorAll("input[type='number']").forEach(input => input.value = "");
            this.recalculate();
        });
    },
    recalculate: function () {
        model.clearAssignments();

        document.querySelectorAll(".input-row").forEach((row, i) => {
            model.addAssignmentResult(i, +row.querySelector("input").value);
        });

        model.addExamResult(+(document.querySelector(".exam-input").value) || 0);
        model.addPresencePercent(+(document.querySelector(".presence-input").value) || 0);

        document.dispatchEvent(new CustomEvent("gradeChanged", { detail: model.calculateGrade() }));
    },
}

controller.init();