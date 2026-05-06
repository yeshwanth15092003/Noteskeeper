// USERS
let users = JSON.parse(localStorage.getItem("users")) || [];

// TASKS
let tasks = [];

// PASSWORD VALIDATION
function isStrongPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(password);
}

// SIGNUP
function signup() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;

  if (!user || !pass) {
    return alert("Enter username & password");
  }

  if (!isStrongPassword(pass)) {
    return alert(
      "Password must be at least 8 characters long and include:\n" +
      "- Uppercase letter\n- Lowercase letter\n- Number\n- Special character"
    );
  }

  if (users.find(u => u.username === user)) {
    return alert("User already exists");
  }

  users.push({ username: user, password: pass });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful! Please login.");
}

// LOGIN
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const valid = users.find(
    u => u.username === user && u.password === pass
  );

  if (!valid) return alert("Invalid credentials");

  localStorage.setItem("loggedInUser", user);

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("appSection").classList.remove("hidden");

  loadUserTasks();
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedInUser");
  location.reload();
}

// LOAD TASKS
function loadUserTasks() {
  const user = localStorage.getItem("loggedInUser");
  tasks = JSON.parse(localStorage.getItem(user + "_tasks")) || [];
  renderTasks();
}

// SAVE TASKS
function saveTasks() {
  const user = localStorage.getItem("loggedInUser");
  localStorage.setItem(user + "_tasks", JSON.stringify(tasks));
}

// ADD TASK
function addTask() {
  const title = document.getElementById("taskTitle").value;
  const desc = document.getElementById("taskDesc").value;

  if (!title) return alert("Task title required");

  tasks.push({
    id: Date.now(),
    title,
    desc,
    completed: false
  });

  saveTasks();
  renderTasks();

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";
}

// TOGGLE TASK
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// DELETE TASK
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// EDIT TASK
function editTask(id) {
  const newTitle = prompt("Edit task:");
  if (!newTitle) return;

  tasks = tasks.map(task =>
    task.id === id ? { ...task, title: newTitle } : task
  );

  saveTasks();
  renderTasks();
}

// RENDER TASKS
function renderTasks() {
  const pending = document.getElementById("pendingTasks");
  const completed = document.getElementById("completedTasks");

  pending.innerHTML = "";
  completed.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.desc || ""}</p>
      <button onclick="toggleTask(${task.id})">
        ${task.completed ? "Undo" : "Done"}
      </button>
      <button onclick="editTask(${task.id})">Edit</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;

    if (task.completed) {
      completed.appendChild(li);
    } else {
      pending.appendChild(li);
    }
  });
}

// AUTO LOGIN
window.onload = () => {
  const user = localStorage.getItem("loggedInUser");

  if (user) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("appSection").classList.remove("hidden");
    loadUserTasks();
  }
};