"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const mainInput = document.querySelector(".new_todo"),
    completeAllCheckbox = document.querySelector(".checkbox_header"),
    list = document.querySelector(".todo_list"),
    btnAll = document.querySelector(".btn_all"),
    btnActive = document.querySelector(".btn_active"),
    btnCompleated = document.querySelector(".btn_compleated"),
    activeCounter = document.querySelector("span strong"),
    btnCompletedDelete = document.querySelector(".clear_completed "),
    countCompleted = document.querySelector(".clear_completed strong"),
    completeAllSpan = document.querySelector(".span"),
    footer = document.querySelector(".footer");

  let showTasks = [],
    tasks = [],
    marker = "all"; // Filter status

  hideAdditionalElements();

  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    filterArr();
    render();
    countTask();
    toggleClearAllBtn();
    hideAdditionalElements();

    btnAll.classList.add("active");
    btnActive.classList.remove("active");
    btnCompleated.classList.remove("active");
  }

  mainInput.addEventListener("keydown", enterTask);

  completeAllCheckbox.addEventListener("change", completeAll);

  btnActive.addEventListener("click", showActiveTasks);

  btnCompleated.addEventListener("click", showCompletedtasks);

  btnAll.addEventListener("click", showAllTasks);

  // footer

  btnCompletedDelete.addEventListener("click", deletCompletedTasks);

  function filterArr() {
    switch (marker) {
      case "all":
        showTasks = tasks;
        break;
      case "active":
        showTasks = tasks.filter((item) => {
          return item.completed === false;
        });
        break;
      case "completed":
        showTasks = tasks.filter((item) => {
          return item.completed === true;
        });
        break;
    }
  }

  function render() {
    clearList();

    showTasks.forEach((item) => {
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
      item.completed && checkbox.setAttribute("checked", "");

      checkbox.setAttribute("type", "checkbox");
      checkbox.setAttribute("data-id", item.id);
      checkbox.classList.add("checkbox");
      checkbox.id = item.id;

      btn.setAttribute("data-id", item.id);
      btn.classList.add("delete");
      btn.textContent = "✖";

      checkmark.classList.add("item_mark");

      task.textContent = `${item.desc}`;
      task.classList.add("item_task");

      input.classList.add("item_task_value");
      input.setAttribute("disabled", "");
      input.setAttribute("data-id", item.id);
      input.value = item.desc;

      label.setAttribute("for", item.id);
      label.classList.add("check_all_label");

      itemList.classList.add("todo_list_item");

      list.appendChild(itemList);
      itemList.appendChild(wrapper);

      wrapper.appendChild(checkmark);
      wrapper.appendChild(task);
      wrapper.appendChild(btnPlace);

      checkmark.appendChild(checkbox);
      checkmark.appendChild(label);

      task.appendChild(input);

      btnPlace.appendChild(btn);

      checkbox.addEventListener("change", toggleCompleteTask);
      task.addEventListener("dblclick", setEditTask);
      btn.addEventListener("click", deleteTask);

      markToggleAllTaks();
      hideAdditionalElements();

      if (item.completed) {
        task.classList.add("active_task");
      }

      footer.classList.remove("hide");
    });
  }

  function clearInput() {
    mainInput.value = "";
  }

  function clearList() {
    document.querySelectorAll(".todo_list_item").forEach((li) => {
      li.remove();
    });
  }

  function deleteTask(e) {
    const id = +e.target.getAttribute("data-id");

    tasks = tasks.filter((item) => {
      return item.id !== id;
    });

    if (tasks.length === 0) {
      marker = "all";
    }

    filterArr();
    render();
    countTask();
    toggleClearAllBtn();

    hideAdditionalElements();
    markToggleAllTaks();

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function toggleCompleteTask(e) {
    tasks.forEach((item) => {
      if (Number(e.target.getAttribute("data-id")) === item.id) {
        item.completed = !item.completed;
      }
    });

    markToggleAllTaks();

    filterArr();
    render();

    countTask();
    toggleClearAllBtn();

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function markToggleAllTaks() {
    const res = tasks.some((item) => !item.completed);

    res
      ? (completeAllCheckbox.checked = false)
      : (completeAllCheckbox.checked = true);
  }

  function countTask() {
    const res = tasks.reduce(
      function (acc, { completed }) {
        if (completed) {
        
          acc.completed += (acc[completed] || 0) + 1;
        } else {
          acc.active += (acc[completed] || 0) + 1;
        }

        return acc;
      },
      { active: 0, completed: 0 }
    );
    countCompleted.textContent = res.completed;
    activeCounter.textContent = res.active;
  }

  function toggleClearAllBtn() {
    const res = tasks.some((item) => {
      return item.completed;
    });

    res
      ? btnCompletedDelete.classList.remove("not_visibility")
      : btnCompletedDelete.classList.add("not_visibility");
  }

  function hideAdditionalElements() {
    if (tasks.length === 0 || localStorage.getItem("tasks") === null) {
      footer.classList.add("hide");
      completeAllSpan.classList.add("not_visibility");
    } else {
      completeAllSpan.classList.remove("not_visibility");
    }
  }

  function showAllTasks() {
    clearList();
    marker = "all";
    filterArr();
    render();
    toggleClearAllBtn();

    btnAll.classList.add("active");
    btnActive.classList.remove("active");
    btnCompleated.classList.remove("active");
  }

  function showActiveTasks() {
    clearList();
    marker = "active";
    filterArr();
    render();

    btnAll.classList.remove("active");
    btnActive.classList.add("active");
    btnCompleated.classList.remove("active");
    if (showTasks.length === 0) {
      completeAllSpan.classList.add("not_visibility");
    }
  }

  function showCompletedtasks() {
    clearList();
    marker = "completed";
    filterArr();
    render();

    btnAll.classList.remove("active");
    btnActive.classList.remove("active");
    btnCompleated.classList.add("active");

    completeAllCheckbox.checked = true;

    tasks.some((item) => {
      if (!item.completed) {
        completeAllCheckbox.checked = false;
      }
    });
  }

  function completeAll() {
    const res = tasks.every((item) => item.completed);

    tasks.forEach((item) =>
      res ? (item.completed = false) : (item.completed = true)
    );
    filterArr();
    render();
    countTask();
    toggleClearAllBtn();
    hideAdditionalElements();

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function enterTask(e) {
    if (e.keyCode === 13 && mainInput.value.trim() && mainInput.value.length <= 35) {
      const item = {
        desc: mainInput.value.trim(),
        id: Date.now(),
        completed: false,
      };
      tasks.push(item);

      filterArr();
      render();
      clearInput();
      countTask();
      hideAdditionalElements();

      if (localStorage.length === 0) {
        footer.classList.remove("hide");
      }
      completeAllCheckbox.checked = false;
      completeAllSpan.classList.remove("not_visibility");

      localStorage.setItem("tasks", JSON.stringify(tasks));

      btnAll.classList.add("active");
      btnActive.classList.remove("active");
      btnCompleated.classList.remove("active");
      if (marker === "active") {
        showActiveTasks();
        console.log("active");
      } else if (marker === "completed") {
        showCompletedtasks();
        console.log("completed");
      }
    }
  }

  function deletCompletedTasks() {
    tasks = tasks.filter((item) => {
      return !item.completed;
    });

    filterArr();
    render();
    countTask();

    completeAllCheckbox.checked = false;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    if (tasks.length === 0) {
      console.log("ok");
      showAllTasks();
      footer.classList.add("hide");
    } else {
      showAllTasks();
    }
  }

  function editTask(event) {
    const target = event.target;

    let taskDeskr = target.value;
    // console.log(taskDeskr);
    if (!taskDeskr.trim()) {
      deleteTask(event);
    }

    if (taskDeskr.length >30){
     taskDeskr = taskDeskr.substring(0, 30)+'...'
      console.log(taskDeskr)
      
    }

    tasks.forEach((item) => {
      if (
        item.id ===
        +target.parentElement.previousElementSibling.firstElementChild.getAttribute(
          "data-id"
        )
      ) {
        item.desc = taskDeskr;
      }

      localStorage.setItem("tasks", JSON.stringify(tasks));
    });
 
    target.classList.remove("active"); 
    
    target.parentElement.previousElementSibling.classList.remove(
      "not_visibility"
    );
    render();
  }

  function setEditTask(e) {
    const target = e.target;

    target.removeAttribute("disabled");
    target.parentElement.previousElementSibling.classList.add("not_visibility");
    target.classList.add("active");
    target.parentElement.nextElementSibling.classList.add("hide");
    target.focus();
    console.log(target)
    target.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 ) {
        target.removeEventListener("blur", editTask);
        editTask(e);
      }
    });
    target.addEventListener("blur", editTask);
  }
});


