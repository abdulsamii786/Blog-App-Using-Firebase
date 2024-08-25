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
  storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebase.js";

let isEdit = null;
let uploadTask;
let getImage;

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
let blogPicInput = document.getElementById("blogPic");
let addBlogsBtn = document.getElementById("addBlogs");
let imgName = document.getElementById("imgName");

const addBlogs = async () => {
  if (blogTitleInput.value !== "" && blogDescInput.value !== "") {
    addBlogsBtn.innerText = "Loading";
    try {
      const docRef = await addDoc(collection(db, "blogs"), {
        title: blogTitleInput.value,
        description: blogDescInput.value,
        category: blogCategoryInput.value,
        image: getImage,
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
  imgName.innerText = "";
};

addBlogsBtn.addEventListener("click", addBlogs);

// upload image functionality===============

let progressBar = document.getElementById("progressBar");
progressBar.style.display = "none";
let imgLoader = document.getElementById("img-loader");
imgLoader.style.display = "none";

const uploadImg = () => {
  let file = blogPicInput.files[0];
  const imagesRef = ref(storage, file.name);
  uploadTask = uploadBytesResumable(imagesRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log("Upload is " + progress + "% done");
      progressBar.style.display = "block";
      imgLoader.style.display = "block";
      progressBar.value = progress;
      imgName.innerText = "";
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        if (downloadURL) {
          progressBar.style.display = "none";
          imgLoader.style.display = "none";
          imgName.innerText = file.name.slice(0, 10) + "...";
        }
        getImage = downloadURL;
        console.log(downloadURL);
      });
    }
  );
};

blogPicInput.addEventListener("change", uploadImg);

// // upload resume functionality===============

// let resumeBtn = document.getElementById("resume");

// const resumeUpload = () => {
//   uploadTask.resume();
// };

// resumeBtn.addEventListener("click", resumeUpload);

// // upload pause functionality===============

// let pauseBtn = document.getElementById("pause");

// const pauseUpload = () => {
//   uploadTask.pause();
// };

// pauseBtn.addEventListener("click", pauseUpload);

// // upload cancel functionality===============

// let cancelBtn = document.getElementById("cancel");

// const cancelUpload = () => {
//   uploadTask.cancel();
// };

// cancelBtn.addEventListener("click", cancelUpload);

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
      const { title, description, category, image } = doc.data();
      //   console.log(`${doc.id} => ${doc.data()}`);
      showBlogsDiv.innerHTML += `    <div class="card my-card col-md-3" style="width: 18rem;">
      <div class="d-flex align-items-center justify-content-center image-card"><img src="${image}" class="card-img-top "></div>
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
    const { title, description, category, image } = userData.data();
    isEdit = id;
    blogTitleInput.value = title;
    blogDescInput.value = description;
    blogCategoryInput.value = category;
    imgName.innerText = image.slice(79,89) + "...";
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
      image: getImage,
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
