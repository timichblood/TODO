let api = "http://localhost:8000/todos";

// ! CREAT
let int1 = document.querySelector(".inp-1");
let addBtn = document.querySelector(".btn-add");

addBtn.addEventListener("click", () => {
  const newContact = {
    firstName: int1.value,
  };

  let checkResult = checkInputs(newContact);
  if (checkResult) {
    showAlert("Fill in pease", "blue", "wight");
    return;
  }

  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  }).then(() => {
    int1.value = "";
    showAlert("Successful added", "blue", "wight");
    getTodo();
  });
});

// ! Check space
function checkInputs(obj) {
  for (let i in obj) {
    if (!obj[i].trim()) {
      return true;
    }
  }
  return false;
}

// ! READ
let ul = document.querySelector(".list-group");
let modal = document.querySelector(".my-modal");
let closeModal = document.querySelector(".close-modal");
let editInp1 = document.querySelector(".edit-inp-1");
let btnSave = document.querySelector(".btn-save");

// ! Pagination
let searchWord = "";
let countPerPage = 5;
let currentPage = 1;
let pagesCount = 1;

const getTodo = () => {
  fetch(`${api}?q=${searchWord}`)
    .then((res) => {
      return res.json();
    })
    .then((todos) => {
      ul.innerHTML = "";

      // ! Pagination
      pagesCount = Math.ceil(todos.length / countPerPage);
      let newTodos = todos.splice(
        (currentPage - 1) * countPerPage,
        countPerPage
      );
      pagination();

      newTodos.forEach((item) => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        const img2 = document.createElement("img");
        const div = document.createElement("div");

        img.setAttribute("src", "./img/delete.png");
        img2.setAttribute("src", "./img/edit.png");
        li.classList.add("list-group-item");
        li.innerHTML = `
        <span>
          ${item.firstName}
        </span>
        `;
        div.append(img2, img);
        li.append(div);
        ul.append(li);

        // ! DELETE
        img.addEventListener("click", () => {
          fetch(`${api}/${item.id}`, {
            method: "DELETE",
          }).then(() => {
            showAlert("Successful deleted", "blue", "wight");
            getTodo();
          });
        });

        // ! UPDATE-1
        img2.addEventListener("click", () => {
          modal.style.display = "flex";
          editInp1.value = item.firstName;
          btnSave.setAttribute("id", item.id);
        });
      });
    });
};
getTodo();

function showAlert(text, bgColor, color) {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: bgColor,
      color: color,
    },
  }).showToast();
}

// ! LIVE SEARCH
let liveSearchInp = document.querySelector(".live-search-inp");

liveSearchInp.addEventListener("input", (event) => {
  searchWord = event.target.value;
  currentPage = 1;
  getTodo();
});

// ! UPDATE-2
btnSave.addEventListener("click", (event) => {
  const editedTodo = {
    firstName: editInp1.value,
  };
  fetch(`${api}/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedTodo),
  }).then(() => {
    modal.style.display = "none";
    getTodo();
  });
});

// ! Mpdal clouse
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// ! Pagination
let ulPagination = document.querySelector(".pagination");

const pagination = () => {
  ulPagination.innerHTML = "";
  for (let i = 1; i <= pagesCount; i++) {
    let li = document.createElement("li");
    li.classList.add("page-link");
    li.innerText = i;
    ulPagination.append(li);
    li.addEventListener("click", () => {
      currentPage = i;
      getTodo();
    });
  }
};
