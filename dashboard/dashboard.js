import {
  auth,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  addDoc,
  getDocs,
} from "../firebase.js";

let logOutBtn = document.getElementById("logOutBtn");

const logOut = () => {
  signOut(auth)
    .then(() => {
      Toastify({
        text: "sign out",
        duration: 3000,
      }).showToast();
    })
    .catch((error) => {
      Toastify({
        text: error,
        duration: 3000,
      }).showToast();
    });
};
logOutBtn.addEventListener("click", logOut);

// redirection functionality=================

onAuthStateChanged(auth, (user) => {
  console.log(user);

  if (!user) {
    window.location.href = "../Login/login.html";
  }
});

// year functionality===============

let d = new Date();
let currentYear = d.getFullYear();

let year = document.getElementById("year");
year.innerText = currentYear;

// add blogs functionality===============

let blogTitleInput = document.getElementById("blogTitle");
let blogDescInput = document.getElementById("blogDesc");
let blogCategoryInput = document.getElementById("category");
let addBlogsBtn = document.getElementById("addBlogs");

const addBlogs = async () => {
  if (blogTitleInput.value !== "" && blogDescInput.value !== "") {
    addBlogsBtn.innerText = "Loading";
    try {
      const docRef = await addDoc(collection(db, "blogs"), {
        title: blogTitleInput.value,
        description: blogDescInput.value,
        category: blogCategoryInput.value,
      });
      console.log("Document written with ID: ", docRef.id);
      showBlogs();
    } catch (e) {
      Toastify({
        text: e,
        duration: 3000,
      }).showToast();
      addBlogsBtn.innerText = "Add+";
    } finally {
      addBlogsBtn.innerText = "Add+";
    }
  } else {
    Toastify({
      text: "Invalid Input ",
      duration: 3000,
    }).showToast();
  }
  blogTitleInput.value = "";
  blogDescInput.value = "";
  blogCategoryInput.value = "";
};
addBlogsBtn.addEventListener("click", addBlogs);

// show blogs functionality===============

let loader = document.getElementById("loader");
loader.style.display = "none";

let showBlogsDiv = document.getElementById("showBlogs");

const showBlogs = async () => {
  loader.style.display = "flex";
  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));

    if (querySnapshot.empty) {
      return (showBlogsDiv.innerHTML = `<img id="errorImg" src="../assets/imgs/No Data.png" alt=""><p style="color: red;" class="text-center">No Data Found</p>`);
    }
    loader.style.display = "none";
    showBlogsDiv.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const { title, description, category } = doc.data();
      //   console.log(`${doc.id} => ${doc.data()}`);
      showBlogsDiv.innerHTML += `    <div class="card my-card col-md-3" style="width: 18rem;">
    <img src="../assets/imgs/lorem.webp" class="card-img-top">
    <div class="card-body my-card-body">
    <span id="blog-category">${category}</span>
      <h5 class="card-title mt-2">${title}</h5>
      <p class="card-text">${description}</a>
    </div>
    </div>`;
    });
  } catch {
    showBlogsDiv.innerHTML = "No Data Found";
  } finally {
    loader.style.display = "none";
  }
};
showBlogs();
