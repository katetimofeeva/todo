"use strict";

document.addEventListener("DOMContentLoaded", () => {
  class GetTasks {
    constructor(
      selectorMainInput,
      marker = "all",
      selectorList,
      selectorCompleteAllCheckbox,
      selectorCompleteAllSpan
    ) {
      this.tasks = [];
      this.showTasks = [];
      this.marker = marker;
      this.mainInput = document.querySelector(selectorMainInput);
      this.list = document.querySelector(selectorList);
      this.completedAllCheckbox = document.querySelector(
        selectorCompleteAllCheckbox
      );
      this.completeAllSpan = document.querySelector(selectorCompleteAllSpan);

      this.mainInput.addEventListener("keydown", (e) => {
        if (
          e.keyCode === 13 &&
          this.mainInput.value.trim() &&
          this.mainInput.value.length <= 35
        ) {
          this.tasks.push(new Task(e.target.value, Date.now(), false));

          this.completedAllCheckbox.checked = false;

          footer.btnAll.classList.add("active");
          footer.btnActive.classList.remove("active");
          footer.btnCompleted.classList.remove("active");

          this.clearList();

          this.clearInput();
          this.hideCheckbox();

          footer.counter();
          footer.hideFooter();

                 this.filterTasks();
          this.render();
          localStorage.setItem("tasks", JSON.stringify(this.tasks));
      
        }
      });
    }

    clearInput() {
      this.mainInput.value = "";
    }

    deleteTask(id) {
      this.tasks = this.tasks.filter((item) => {
     
        return item.id !== id;
      });

      this.filterTasks();
      this.render();
      this.changeValueTask();
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    changeValueTask(id, completed) {
 
      this.tasks.forEach((item) => {
        if (item.id === id) {
          
          item.completed = !completed;
        }
      });

      const res = this.tasks.every((item) => item.completed);
      res
        ? (this.completedAllCheckbox.checked = true)
        : (this.completedAllCheckbox.checked = false);

      this.hideCheckbox();
      footer.counter();

      this.render();
      localStorage.setItem("tasks", JSON.stringify(main.tasks));
    }

    hideCheckbox() {
      if (this.tasks.length === 0 && localStorage.getItem("tasks")) {
       

        console.log("not visibility checkbox");
        console.log(
          !localStorage.getItem("tasks"),
          '!localStorage.getItem("tasks")'
        );
        console.log(this.tasks.length === 0, "this.tasks.length === 0 ");
        this.completeAllSpan.classList.add("not_visibility");
      } else {
        this.completeAllSpan.classList.remove("not_visibility");
      }
    }
    filterTasks() {
      switch (this.marker) {
        case "all":
          this.showTasks = this.tasks;
          // console.log(this.showTasks, "all");
          break;
        case "active":
          this.showTasks = this.tasks.filter((item) => {
            return item.completed === false;
          });
          // console.log(this.showTasks, "active");
          break;
        case "completed":
          this.showTasks = this.tasks.filter((item) => {
            return item.completed === true;
          });
          // console.log(this.showTasks, "completed");
          break;
      }
    }

    clearList() {
      document.querySelectorAll(".todo_list_item").forEach((li) => {
        li.remove();
      });
    }

    toggleMainCheckbox() {
      // console.log("ok");
      if (this.completedAllCheckbox.checked) {
        this.tasks.forEach((item) => {
          return (item.completed = true);
        });
      } else {
        this.tasks.forEach((item) => {
          return (item.completed = false);
        });
      }
      footer.counter();
      this.render();
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    bindToggleMainCheckbox() {
      this.completedAllCheckbox.addEventListener("click", () => {
        this.toggleMainCheckbox();
      });
    }

    loadFromLS() {
      if (localStorage.getItem("tasks")) {
       
        main.tasks = JSON.parse(localStorage.getItem("tasks")).map(
          (item) => new Task(item.descr, item.id, item.completed)
        );
 
        main.render();
      }
    }

    init() {
      this.loadFromLS(), this.filterTasks(), this.render();
    }

    render() {
      this.clearList();
      console.log("render");
      this.showTasks.forEach((taskItem) => {
        // console.log(item, "item");
        const itemList = document.createElement("li"),
          wrapper = document.createElement("div"),
          checkmark = document.createElement("div"),
          checkbox = document.createElement("input"),
          label = document.createElement("label"),
          task = document.createElement("div"),
          input = document.createElement("input"),
          btnPlace = document.createElement("div"),
          btn = document.createElement("button");

        wrapper.classList.add("wrapper");
        taskItem.completed && checkbox.setAttribute("checked", "");

        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("data-id", taskItem.id);
        checkbox.classList.add("checkbox");
        checkbox.id = taskItem.id;

        btn.setAttribute("data-id", taskItem.id);
        btn.classList.add("delete");
        btn.textContent = "✖";

        checkmark.classList.add("item_mark");

        task.textContent = `${taskItem.descr}`;
        task.classList.add("item_task");

        input.classList.add("item_task_value");
        input.setAttribute("disabled", "");
        input.setAttribute("data-id", taskItem.id);
        input.value = taskItem.desc;

        label.setAttribute("for", taskItem.id);
        label.classList.add("check_all_label");

        itemList.classList.add("todo_list_item");

        this.list.appendChild(itemList);
        itemList.appendChild(wrapper);

        wrapper.appendChild(checkmark);
        wrapper.appendChild(task);
        wrapper.appendChild(btnPlace);

        checkmark.appendChild(checkbox);
        checkmark.appendChild(label);

        task.appendChild(input);

        btnPlace.appendChild(btn);
       

        btn.addEventListener("click", () => taskItem.deleteTask());

        // console.log("taskItem", taskItem);
        task.addEventListener("dblclick", taskItem.setEdit.bind(taskItem));

        checkbox.addEventListener("change", (e) =>
          taskItem.toggleCompleteTask(e)
        );

        localStorage.setItem("tasks", JSON.stringify(this.tasks));
      });
    }
  }

  class Task {
    constructor(descr, id, completed) {
      // console.log(id, "id from constructor");
      this.id = id;
      this.descr = descr;
      this.completed = completed;
    }

    deleteTask() {
      // console.log(this.id, "id");
      main.deleteTask(this.id);
    }

    toggleCompleteTask() {
      // taskValue.changeValueTask(this.id);
      main.changeValueTask(this.id, this.completed);
    }

    setEdit(e) {
      const target = e.target;
      target.focus();

      target.removeAttribute("disabled");
      target.classList.add("active");
      target.value = this.descr;
      console.log(target);
      target.focus();

      target.addEventListener("blur", () => {
        target.parentElement.nextElementSibling.classList.add("hide");
        this.descr = target.value;

        target.classList.remove("active");

        target.parentElement.nextElementSibling.classList.remove("hide");
        main.render();
        // this.editTask()
      });

      console.log(this);
    }
  }

  class Footer {
    constructor(
      selFooter,
      selCounterActiveTasks,
      selBtnAll,
      selBtnActive,
      seleBtnCompleted,
      selCounterCompletedTasks
    ) {
      this.footer = document.querySelector(selFooter);
      this.activeTask = document.querySelector(selCounterActiveTasks);
      this.completedTask = document.querySelector(selCounterCompletedTasks);
      this.btnAll = document.querySelector(selBtnAll);
      this.btnActive = document.querySelector(selBtnActive);
      this.btnCompleted = document.querySelector(seleBtnCompleted);
    }

    hideFooter() {
      if (main.tasks.length === 0 && localStorage.getItem("tasks") === null) {
        this.footer.classList.add("hide");
      } else {
        this.footer.classList.remove("hide");
      }
    }

    counter() {
      const res = main.tasks.reduce(
        function (acc, current) {
      
          if (current.completed) {
            acc.completed += (acc[current.completed] || 0) + 1;
          } else {
            acc.active += (acc[current.completed] || 0) + 1;
          }
          return acc;
        },
        { active: 0, completed: 0 }
      );

      this.activeTask.textContent = res.active;
      this.completedTask.textContent = res.completed;
    }
    delete() {
      main.deleteTask();
    }

    toggleBtnCompleteTask() {
      console.log(this.completedTask.parentElement);
      const res = main.tasks.some((item) => {
       
        return item.completed;
      });
      console.log(res);
      res
        ? this.completedTask.parentElement. classList.remove("not_visibility")
        : this.completedTask.parentElement.classList.add("not_visibility");
    }

    showAllTasks() {
      main.clearList();
      main.marker = "all";
      main.filterTasks();
      this.delete();
      main.render();

      this.btnAll.classList.add("active");
      this.btnActive.classList.remove("active");
      this.btnCompleted.classList.remove("active");
    
    }

    showActiveTasks() {
      main.clearList();
      main.marker = "active";
      main.filterTasks();

      main.render();

      this.btnAll.classList.remove("active");
      this.btnActive.classList.add("active");
      this.btnCompleted.classList.remove("active");

      if (main.showTasks.length === 0) {
        console.log("11111111111111111111");
        main.completeAllSpan.classList.add("not_visibility");
      }
    }

    showCompletedTasks() {
      main.clearList();
      main.marker = "completed";
      main.filterTasks();

      this.btnAll.classList.remove("active");
      this.btnActive.classList.remove("active");
      this.btnCompleted.classList.add("active");

      main.completedAllCheckbox.checked = true;
      main.completeAllSpan.classList.remove("not_visibility");
      main.tasks.some((item) => {
        if (!item.completed) {
          main.completedAllCheckbox.checked = false;
        }
      });

      main.render();
    }

    bindevent() {
      this.btnAll.addEventListener("click", () => {
        this.showAllTasks();
      });
      this.btnActive.addEventListener("click", () => {
        this.showActiveTasks();
      });
      this.btnCompleted.addEventListener("click", () => {
        this.showCompletedTasks();
      });
    }
  }

  const main = new GetTasks(
    ".new_todo",
    "all",
    ".todo_list",
    ".checkbox_header",
    ".span"
  ); //main

  window.main = main;

  main.bindToggleMainCheckbox();
  main.init();

  const footer = new Footer(
    ".footer",
    ".todo_active strong",
    ".btn_all",
    ".btn_active",
    ".btn_compleated", // oшиблась при названии класса
    ".clear_completed strong"
  );
  footer.counter();

  footer.hideFooter();
  footer.bindevent();
  footer.toggleBtnCompleteTask();
});
