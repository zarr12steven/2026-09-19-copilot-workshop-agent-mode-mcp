const STORAGE_KEY = "offline-todo-items";
const THEME_STORAGE_KEY = "offline-todo-theme";
const FILTER_STORAGE_KEY = "offline-todo-filter";
const VALID_FILTERS = ["all", "active", "completed"];

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const remainingCount = document.querySelector("#remaining-count");
const itemCount = document.querySelector("#item-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");
const filterButtons = document.querySelectorAll(".filter-button");

let todos = loadTodos();
let currentFilter = loadFilter();

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

// 讀取並驗證使用者上次選擇的篩選條件。
function loadFilter() {
  const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
  return VALID_FILTERS.includes(savedFilter) ? savedFilter : "all";
}

// 更新篩選按鈕的選中狀態。
function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });
}

// 取得目前應套用的主題，未手動設定時交給作業系統偏好決定。
function getActiveTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// 套用主題並更新切換按鈕的文字與圖示。
function applyTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const activeTheme = getActiveTheme();
  document.documentElement.dataset.theme = savedTheme || "";
  themeIcon.textContent = activeTheme === "dark" ? "☀️" : "🌙";
  themeLabel.textContent = activeTheme === "dark" ? "淺色模式" : "深色模式";
  themeToggle.setAttribute("aria-pressed", activeTheme === "dark");
}

// 只保留目前篩選條件符合的項目。
function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 更新畫面上的清單與統計數字。
function renderTodos() {
  todoList.replaceChildren();
  const visibleTodos = getVisibleTodos();
  emptyMessage.hidden = visibleTodos.length > 0;
  emptyMessage.textContent = todos.length === 0
    ? "還沒有任何待辦事項,新增一個吧!"
    : currentFilter === "active"
      ? "目前沒有未完成的待辦事項，其他項目可能已被篩選條件隱藏，並未刪除。"
      : currentFilter === "completed"
        ? "目前沒有已完成的待辦事項，其他項目可能已被篩選條件隱藏，並未刪除。"
        : "還沒有任何待辦事項,新增一個吧!";
  itemCount.textContent = todos.length;

  visibleTodos.forEach((todo) => {
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
  clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
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
  const completedCount = todos.filter((todo) => todo.completed).length;

  if (completedCount === 0) {
    return;
  }

  const shouldClear = window.confirm(`確定要清除 ${completedCount} 項已完成的待辦事項嗎？`);
  if (!shouldClear) {
    return;
  }

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

themeToggle.addEventListener("click", () => {
  const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
    updateFilterButtons();
    renderTodos();
  });
});

applyTheme();
updateFilterButtons();
renderTodos();
