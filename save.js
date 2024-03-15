// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCe-Lv2CTrycC64DORXZFuJ79F6DRVGWrQ",
    authDomain: "bubble-up-e9d7b.firebaseapp.com",
    projectId: "bubble-up-e9d7b",
    storageBucket: "bubble-up-e9d7b.appspot.com",
    messagingSenderId: "1023805450824",
    appId: "1:1023805450824:web:81581e23d9d242ae78867d",
    measurementId: "G-X4SNB5YDTC"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginDiv = document.querySelector(".login-div");

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginDiv.remove();
        PopulateTasksFromDatabase();
    } else {
        console.log("no user");
    }
});

async function SignIn() {

    if (auth.user != null) return;

    signInWithPopup(auth, provider)
        .then(() => {

        })
}

async function PopulateTasksFromDatabase() {
    const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "tasks"));
    querySnapshot.forEach((doc) => {
        const task = doc.data();
        new TaskBubble(GetRandomPositionOutsideScreen(100), task.title, task.date, task.color, task.scale, doc.id);
    });
}

async function CreateDatabaseTask(bubbleBody) {
    try {
        const taskRef = await addDoc(collection(db, "users", auth.currentUser.uid, "tasks"), {
            title: bubbleBody.title,
            date: bubbleBody.date != null ? bubbleBody.date : "",
            color: bubbleBody.render.fillStyle,
            scale: bubbleBody.scaler
        });
        bubbleBody.id = taskRef.id;
        console.log("Document added with ID: ", bubbleBody.id);
    } catch (e) {
        console.error("Error adding document: ", bubbleBody.id);
    }
}

async function EditDatabaseTask(bubbleBody) {
    const taskRef = doc(collection(db, "users", auth.currentUser.uid, "tasks"), bubbleBody.id);
    await updateDoc(taskRef, {
        title: bubbleBody.title,
        date: bubbleBody.date != null ? bubbleBody.date : "",
        color: bubbleBody.render.fillStyle,
        scale: bubbleBody.scaler
    });
    console.log("Document edited with ID: ", bubbleBody.id);

}

async function DeleteDatabaseTask(bubbleBody) {
    const taskRef = doc(collection(db, "users", auth.currentUser.uid, "tasks"), bubbleBody.id);
    await deleteDoc(taskRef);
}

async function SignOut() {
    signOut(auth).then(() => {
        console.log("logged out");
    }).catch((error) => {
        console.log("error");
    });
}

window.CreateDatabaseTask = CreateDatabaseTask;
window.EditDatabaseTask = EditDatabaseTask;
window.DeleteDatabaseTask = DeleteDatabaseTask;
window.SignIn = SignIn;
window.SignOut = SignOut;