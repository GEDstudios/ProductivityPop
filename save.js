// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

async function AddTaskToDatabase(bubbleBody) {
    try {
        const docRef = await addDoc(collection(db, "tasks"), {
            title: bubbleBody.title,
            date: bubbleBody.date != null ? bubbleBody.date : "",
            color: bubbleBody.render.fillStyle,
            scale: bubbleBody.scaler
        });
        bubbleBody.id = docRef.id;
        console.log("Document written with ID: ", bubbleBody.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}



async function EditDatabaseTask(bubbleBody) {
    try {
        const taskRef = doc(collection(db, "tasks"), bubbleBody.id);
        await updateDoc(taskRef, {
            title: bubbleBody.title,
            date: bubbleBody.date != null ? bubbleBody.date : "",
            color: bubbleBody.render.fillStyle,
            scale: bubbleBody.scaler
        });
        console.log("Document edited with ID: ", bubbleBody.id);
    } catch (e) {
        console.error("Error edited document: ", e);
    }
}

async function DeleteDatabaseTask(bubbleBody) {
    const taskRef = doc(collection(db, "tasks"), bubbleBody.id);
    await deleteDoc(taskRef);
}

const querySnapshot = await getDocs(collection(db, "tasks"));
querySnapshot.forEach((doc) => {
    new TaskBubble({ x: 50, y: 50 }, doc.data.title, doc.data.date, doc.data.color, doc.data.scale);
});

window.AddTaskToDatabase = AddTaskToDatabase;
window.EditDatabaseTask = EditDatabaseTask;
window.DeleteDatabaseTask = DeleteDatabaseTask;