import {
  auth,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "../firebase.js";

let isEdit = null;

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
  // console.log(user);

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
      // console.log("Document written with ID: ", docRef.id);
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
    <img src="../assets/imgs/undraw_zoom_in_1txs.png" class="card-img-top">
    <div class="card-body my-card-body">
    <span id="blog-category">${category}</span>
      <h5 class="card-title mt-2">${title}</h5>
      <p class="card-text">${description}</a>
    </div>
    <div class="btn-wrapper d-flex flex-column">
          <button onclick="edit('${doc.id}',this)">Edit</button>
          <button class="delete" onclick="del('${doc.id}',this)">Delete</button>
    </div>
    </div>`;
    });
  } catch {
    showBlogsDiv.innerHTML = "No Data Found";
  } finally {
    loader.style.display = "none";
  }
};

window.del = async (id, button) => {
  button.innerText = "Deleting";
  try {
    await deleteDoc(doc(db, "blogs", id));
    showBlogs();
  } catch (error) {
    console.log(error);
  }
};

window.edit = async (id, button) => {
  try {
    addBlogsBtn.style.display = "none";
    updateBlogsBtn.style.display = "block";
    let userData = await getDoc(doc(db, "blogs", id));
    const { title, description, category } = userData.data();
    isEdit = id;
    blogTitleInput.value = title;
    blogDescInput.value = description;
    blogCategoryInput.value = category;
    showBlogs();
  } catch (error) {
    console.log(error);
  }
};

let updateBlogsBtn = document.getElementById("updateBlogs");
updateBlogsBtn.style.display = "none";

const updateData = async () => {
  try {
    await updateDoc(doc(db, "blogs", isEdit), {
      title: blogTitleInput.value,
      description: blogDescInput.value,
      category: blogCategoryInput.value,
    });
    showBlogs();
    blogTitleInput.value = "";
    blogDescInput.value = "";
    blogCategoryInput.value = "";
    updateBlogsBtn.style.display = "none";
    addBlogsBtn.style.display = "block";
  } catch (error) {
    console.log(error);
  }
};

updateBlogsBtn.addEventListener("click", updateData);

showBlogs();
