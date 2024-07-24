import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, increment, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDno8QgblBD8lgW-UON2Au2EgCaWv8yFek",
    authDomain: "login-form-3e9d9.firebaseapp.com",
    projectId: "login-form-3e9d9",
    storageBucket: "login-form-3e9d9.appspot.com",
    messagingSenderId: "930056639787",
    appId: "1:930056639787:web:a0b4e7ba5dc484452ea16e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

let userId;

onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
    } else {
        // Redirect to login page if user is not authenticated
        window.location.href = 'index.html';
    }
});

document.getElementById('shareButton').addEventListener('click', async () => {
    const url = "https://www.iskconbangalore.org";
    const message = `Hare Krishna! Welcome to the contest. Your friend has sent you this message to participate. ${url}`;
    
    document.getElementById('shareMessage').innerHTML = `
        <input type="text" id="shareText" value="${message}" readonly style="position:absolute; left:-9999px;">
        <button id="copyLink">Copy to Clipboard</button>
    `;

    // Add event listener to the copy button
    document.getElementById('copyLink').addEventListener('click', async () => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                shares: increment(1)
            });
            const shareText = document.getElementById('shareText');
            shareText.select();
            document.execCommand('copy');
            alert("Link copied to clipboard!");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    });
});

// Display user details
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;
                } else {
                    console.log("No document found matching id");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("User Id not found in Local storage");
    }
});

// Logout functionality
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});



