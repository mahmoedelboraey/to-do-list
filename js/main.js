// dom selection
const forElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const apiKey = "676fdace60a208ee1fdeda0d";
const loadingScreen = document.querySelector(".loading")
let allTodos = [];

// if the array have the data display it
getAllTodos();

forElement.addEventListener("submit", function (e) {
  e.preventDefault();
  // creat if condtion to no alot request empty input
  if (inputElement.value.trim().length > 0) {
    addToDo();
    // trim to remover the space
  }
});

async function addToDo() {
    // loading show add while we call api 
    showLoading()
    //add
    // if(allTodos.length  == null){
    //     document.querySelector(".no-task").classList.remove('d-none')
    // }
    // else{
    //     console.log("mahmoud")
    // }
    
  
  const todo = {
    // obj from API BACK END
    title: inputElement.value,
    // global var
    apiKey: apiKey,
  };
  const obj = {
    // طريقه استدعاء API
    method: "POST",
    // هيتخزن فين
    body: JSON.stringify(todo),
    // اعرف الباك ان ال data جايه josn
    headers: {
      // type is json
      "content-type": "application/json",
    },
  };
  // call api
  let respons = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
  // check stutes of api
  if (respons.ok) {
    // return respons to json
    let data = await respons.json();
    //check
    if (data.message === "success") {
      console.log("add");

      // toastr package to alret message
      toastr.success("Added Successfully", "Toastr app");
      // call getAllTodos

      await getAllTodos();
      // clear form
      forElement.reset();
    }
  }
  // hied loading after call api 
  hideLoading()
}

// get  data

async function getAllTodos() {
    // loading show add while we call api
    showLoading()
  // call api with the apikey
  let respons = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );

  // check stutes
  if (respons.ok) {
    let data = await respons.json();
    if (data.message === "success") {
      // todos: is array save the todo list
      allTodos = data.todos;

      displayData();
    }
  }
  //hied loading after call api 
  hideLoading()
}

// display
function displayData() {
  let cartona = "";
  // loop
  for (const todo of allTodos) {
    cartona += `
        <li class="d-flex align-content-center justify-content-between px-2 border-bottom pb-2">
        
        <span onclick = markCompleted('${todo._id}') style="${
      todo.completed ? "text-decoration: line-through;" : ""
    }" class="customer-input">${todo.title}</span>

        <div class="d-flex align-items-center gap-4">
          ${
            todo.completed
              ? '<span><i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i></span>'
              : ""
          }
          <span onclick = deletItem('${
            todo._id
          }') class="icon rounded"><i class="fa-solid fa-trash-can"></i></span>
        </div>
        
      </li>
        `;
    // delet ${todo._id} it not string transform it to  "${todo._id}" it to get id of index
    // check if the todo complet title line-through , check if the todo complet title display icon check
    document.querySelector(".section-customer").innerHTML = cartona;


    
    
  }
  // to change with the display 
  changeProgress()
}

// delet

async function deletItem(idTodo) {
  // idTodo is the id of the index

  // sweet alrt2
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to delet this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
        //loading show add while we call api
        showLoading()
      const todoData = {
        // the api is have the id
        todoId: idTodo,
      };
      // the way to call api delet
      const obj = {
        method: "DELETE",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": "application/json",
        },
      };
      // call api
      let respons = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );
      if (respons.ok) {
        let data = await respons.json();
        if (data.message === "success") {
          // the second box of sweet alart
          Swal.fire({
            title: "Deleted!",
            text: "Your Todo has been deleted.",
            icon: "success",
          });
          // to edit the display and delet from api
          await getAllTodos();
        }
      }
      //hied loading after call api 
      hideLoading()
    }
  });
}

// complet
async function markCompleted(idTodo) {
    Swal.fire({
        title: "Are you sure?",
        text: "You are Completed it ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then(async (result) => {
        if (result.isConfirmed) {
            //loading show add while we call api
            showLoading()

            const todoData = {
                todoId: idTodo,
              };
              const obj = {
                method: "PUT",
                body: JSON.stringify(todoData),
                headers: {
                  "content-type": "application/json",
                },
              };
              let respons = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
              if (respons.ok) {
                data = await respons.json();
                if (data.message === "success") {
                    Swal.fire({
                        title: "Completed!",
                        icon: "success"
                      });
                  await getAllTodos();
                }
              }
              //hied loading after call api 
              hideLoading()
         
        }
      });  
    
}


function showLoading(){
    loadingScreen.classList.remove("d-none")
    
}
function hideLoading(){
    loadingScreen.classList.add("d-none")
}
function changeProgress(){
    // filter the array and get the number of the task is complet 
    const completTaskNumber = allTodos.filter((todo) => todo.completed).length
    // total number of array 
    const totalNumber = allTodos.length 
    document.getElementById("progress").style.width =`${(completTaskNumber / totalNumber) *100}%`
   const statusNumber  = document.querySelectorAll(".status-number span")  // return array 
   
   statusNumber[0].innerHTML = completTaskNumber
   statusNumber[1].innerHTML=totalNumber
}