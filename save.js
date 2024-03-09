// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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
function SignIn() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            console.log(user);
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

async function CreateDatabaseTask(bubbleBody) {
    try {
        const taskRef = await addDoc(collection(db, "tasks"), {
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
    const taskRef = doc(collection(db, "tasks"), bubbleBody.id);
    await updateDoc(taskRef, {
        title: bubbleBody.title,
        date: bubbleBody.date != null ? bubbleBody.date : "",
        color: bubbleBody.render.fillStyle,
        scale: bubbleBody.scaler
    });
    console.log("Document edited with ID: ", bubbleBody.id);

}

async function DeleteDatabaseTask(bubbleBody) {
    const id = bubbleBody.id;
    const taskRef = doc(collection(db, "tasks"), id);
    await deleteDoc(taskRef);
}

const querySnapshot = await getDocs(collection(db, "tasks"));
querySnapshot.forEach((doc) => {
    new TaskBubble(GetRandomPositionOutsideScreen(100), doc.data().title, doc.data().date, doc.data().color, doc.data().scale, doc.id);
});

window.CreateDatabaseTask = CreateDatabaseTask;
window.EditDatabaseTask = EditDatabaseTask;
window.DeleteDatabaseTask = DeleteDatabaseTask;