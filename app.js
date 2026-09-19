const STORAGE_KEY = "offline-todo-items";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const remainingCount = document.querySelector("#remaining-count");
const itemCount = document.querySelector("#item-count");
const clearCompletedButton = document.querySelector("#clear-completed");

let todos = loadTodos();

// 從瀏覽器的 localStorage 讀取待辦資料。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch (error) {
    return [];
  }
}

// 將目前的待辦資料保存到瀏覽器。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 更新畫面上的清單與統計數字。
function renderTodos() {
  todoList.replaceChildren();
  emptyMessage.hidden = todos.length > 0;
  itemCount.textContent = todos.length;

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";
    todoItem.classList.toggle("completed", todo.completed);

    const checkbox = document.createElement("input");
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `標記「${todo.text}」為完成`);
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((item) => item.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    todoItem.append(checkbox, todoText, deleteButton);
    todoList.append(todoItem);
  });

  const unfinishedCount = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${unfinishedCount} 項`;
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();

  if (!text) {
    todoInput.focus();
    return;
  }

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();
  todoForm.reset();
  todoInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

renderTodos();
