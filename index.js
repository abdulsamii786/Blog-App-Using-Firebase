import {
  auth,
  onAuthStateChanged,
  db,
  collection,
  addDoc,
  getDocs,
} from "./firebase.js";

let loader = document.getElementById("loader");
loader.style.display = "none";

// redirection functionality=================

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    window.location.href = "./dashboard/dashboard.html";
  }
});

// year functionality===============

let d = new Date();
let currentYear = d.getFullYear();

let year = document.getElementById("year");

year.innerText = currentYear;

// showing Blogs functionality===============

let showDataOnIndex = document.getElementById("showDataOnIndex");

const showBlogs = async () => {
  loader.style.display = "flex";

  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    if (querySnapshot.empty) {
      return (showDataOnIndex.innerHTML = `<img id="errorImg" src="../assets/imgs/No Data.png" alt=""><p style="color: red;" class="text-center">No Data Found</p>`);
    }
    showDataOnIndex.innerHTML = "";
    loader.style.display = "none";
    querySnapshot.forEach((doc) => {
      const { title, description, category } = doc.data();
      // console.log(`${doc.id} => ${doc.data()}`);

      if (title && description) {
        showDataOnIndex.innerHTML += `
      <div class="card col-md-3 mb-2 my-card" style="width: 16rem;">
      <img src="./assets/imgs/lorem.webp" class="card-img-top">
      <div class="card-body my-card-body">
          <span  id="blog-category">${category}</span>
        <h5 class="card-title mt-2">${title}</h5>
        <p class="card-text">${description}</a>
      </div>
      </div>
        `;
      }
    });
  } catch {
  } finally {
    loader.style.display = "none";
  }
};
showBlogs();
