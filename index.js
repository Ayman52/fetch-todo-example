// select the container in which we can append all the work to show up on the page
const todoList = document.querySelector("#todo__list");
const counter = document.getElementById("counter-text");
const todoForm = document.querySelector(".todo__form");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search--todo");

const clear = document.querySelector("#clear-btn");
clear.addEventListener("click", () => {
  localStorage.clear();
  displayTodo("");
});

/////////////////////////
// for popup edit window
const editWindow = document.querySelector(".edit-window");
const editConfirm = document.querySelector("#edit-btn");
const editCancel = document.querySelector("#edit-cancel");
const editInput = document.querySelector("#edit-input");

///////////////////////
// creating an array to store all to-dos
// Retrieve data from local storage if available
const storedTodos = localStorage.getItem("todos");
const todoArray = storedTodos ? JSON.parse(storedTodos) : [];

// fetch data from API
fetch("https://jsonplaceholder.typicode.com/todos")
  .then((res) => res.json())
  .then((apiTodos) => {
    for (const todo of apiTodos) {
      if (todo.id < 30) {
        addTodo(todo.title);
      }
    }
  });

// listen to the HTML form to get the user input then add it to the todoArray
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const todoInput = document.querySelector("#add--todo");
  const inputText = todoInput.value.trim();
  if (inputText !== "") {
    addTodo(inputText);
    todoInput.value = "";
    todoInput.focus();
  }
});
searchForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
});
searchInput.addEventListener("input", (event) => searchTodo(event));
///////////////////////////////////////////

const displayTodo = (todoArray) => {
  // setting the todoList array to zero so it doesn't render
  // the same thing each time a new todo is added
  todoList.textContent = "";

  //   the loop that keeps the app running and rendering HTML elements
  for (let i = 0; i < todoArray.length; i++) {
    // creating a div element to render todo items dynamically
    const todoItem = document.createElement("div");

    // assign a css class to it for styling
    todoItem.classList.add("todo__item");

    // creating a checkbox element and appending it as a child to todoItem
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todoArray[i].checked;
    todoItem.appendChild(checkbox);

    // creating a paragraph element and appending it as a child to todoItem
    const content = document.createElement("p");
    if (checkbox.checked) {
      content.classList.add("task-checked");
    } else {
      content.classList.add("task-unchecked");
    }
    content.textContent = todoArray[i].content;
    todoItem.appendChild(content);

    // listen to the checkbox event to change the style of the text if checked
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        content.classList.add("task-checked");
        todoArray[i].checked = true;
        updateLocalStorage();
        console.log(todoArray);
      } else {
        content.classList = "task-unchecked";
        todoArray[i].checked = false;
        updateLocalStorage();
        console.log(todoArray);
      }
    });
    //////////////////////////

    // creating a delete button element and appending it as a child to todoItem
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    // deleteButton.textContent = "Delete";
    todoItem.appendChild(deleteButton);

    // listen to the delete button and then apply the deleteTodo function once clicked
    deleteButton.addEventListener("click", () => deleteTodo(i));
    ///////////////////////////////////////

    // creating an edit button element and appending it as a child to todoItem
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", (event) => {
      editWindow.style.display = "block";
    });
    editCancel.addEventListener("click", () => {
      editWindow.style.display = "none";
    });
    editConfirm.addEventListener("click", () => {
      console.log(editInput.value.trim());
    });
    todoItem.appendChild(editButton);

    // add todoItem as a child to todoList
    todoList.appendChild(todoItem);
    console.log(todoArray);
  }
  counter.textContent = `You have ${todoArray.length} tasks`;
};

//////////////////////////////////////

// a function to add new text to todoArray of objects, and set the checked property to false
const addTodo = (title) => {
  const todo = {
    content: title,
    checked: false,
  };
  todoArray.push(todo);
  displayTodo(todoArray);
  updateLocalStorage();
};
/////////////////////////////////////

// a function that delete a todoItem based on a given array index
const deleteTodo = (index) => {
  todoArray.splice(index, 1);
  updateLocalStorage();
  displayTodo(todoArray);
};
//////////////////////////

// const editTodo = (event) => {

// };

///////////////////////////
const searchTodo = (event) => {
  event.preventDefault();
  const searchInput = event.target.value;
  const modifiedSearchInput = searchInput.trim().toLowerCase();

  const filteredTodos = todoArray.filter((todo) =>
    todo.content.toLowerCase().includes(modifiedSearchInput)
  );

  displayTodo(filteredTodos);
};
////////////////////////////
// Function to update local storage with current todoArray
const updateLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todoArray));
};
displayTodo(todoArray);
