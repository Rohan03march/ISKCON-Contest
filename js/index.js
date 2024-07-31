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
        window.location.href = 'login.html';
    }
});

// Function to handle copying the URL to the clipboard and updating user shares
// Function to fetch userId and handle sharing
document.getElementById('share').addEventListener('click', async () => {
    try {
        // Assume `userId` is stored in a global variable or fetched from Firebase Auth
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User not authenticated");
        }

        const userId = user.uid; // Fetching userId from Firebase Auth
        
        // Reference to the Firestore document
        const userRef = doc(db, "users", userId);

        // Update user shares count in Firestore
        await updateDoc(userRef, {
            shares: increment(1)
        });

        // Define the dynamically generated URL
        const url = `https://iskcon-contest.netlify.app/?${userId}`;
        const message = `🎉 Welcome to the Krishna Janmashtami Contest! 🎉
 Join us in celebrating Krishna Janmashtami by participating in our exciting contest. visit here: ${url}
🕉️ Hare Krishna!
                `;

        // Create a temporary textarea to copy the message
        const textarea = document.createElement('textarea');
        textarea.value = message;
        document.body.appendChild(textarea);

        // Select and copy the message
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        alert("Message copied!");
    } catch (error) {
        console.error("Error: ", error);
        alert("An error occurred. Please try again.");
    }
});



document.getElementById('sbutton').addEventListener('click',async() => {
    try {
        const userRef = doc(db,"users",userId);
        await updateDoc(userRef, {
            points: increment(10)
        });
    } catch (error) {
        console.error("Error",error);
    }
});

document.getElementById('sbutton2').addEventListener('click',async() => {
    try {
        const userRef = doc(db,"users",userId);
        await updateDoc(userRef, {
            points: increment(10)
        });
    } catch (error) {
        console.error("Error",error);
    }
});
document.getElementById('sbutton3').addEventListener('click',async() => {
    try {
        const userRef = doc(db,"users",userId);
        await updateDoc(userRef, {
            points: increment(10)
        });
    } catch (error) {
        console.error("Error",error);
    }
});
document.getElementById('sbutton4').addEventListener('click',async() => {
    try {
        const userRef = doc(db,"users",userId);
        await updateDoc(userRef, {
            points: increment(10)
        });
    } catch (error) {
        console.error("Error",error);
    }
});
document.getElementById('sbutton5').addEventListener('click',async() => {
    try {
        const userRef = doc(db,"users",userId);
        await updateDoc(userRef, {
            points: increment(10)
        });
    } catch (error) {
        console.error("Error",error);
    }
});
document.getElementById('sbutton6').addEventListener('click',async() => {
    try {
        const userRef = doc(db,"users",userId);
        await updateDoc(userRef, {
            points: increment(10)
        });
    } catch (error) {
        console.error("Error",error);
    }
});

// Define the different share URLs for each platform
const shareUrls = {
    whatsapp: "https://api.whatsapp.com/send?text=",
    linkedin: "https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=",
    twitter: "https://twitter.com/intent/tweet?text="
};

// Function to handle share button clicks
async function handleShare(platform) {
    try {
        // Update user shares count in Firestore (assuming userId is defined somewhere)
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            shares: increment(5)
        });

        // Define the message to be shared
        const url = "https://iskcon-contest.netlify.app/";
        const message = `Join me on ISKCON Contest to win some Exciting Prizes. Create your account by using this link here: ${url}`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);

        // Create the full share URL
        const shareUrl = shareUrls[platform] + encodedMessage;

        // Open the share URL in a new tab
        window.open(shareUrl, '_blank');
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

// Add event listeners for different buttons
document.getElementById('copyLink1').addEventListener('click', () => handleShare('whatsapp'));
document.getElementById('copyLink4').addEventListener('click', () => handleShare('linkedin'));
document.getElementById('copyLink5').addEventListener('click', () => handleShare('linkedin'));




//------------------------------------------------------------------------------
//Follow Data 

document.getElementById('sbutton').addEventListener('click',async() => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
                Points: increment(10)
        });
    } catch (error) {
            console.error("Error updating document:", error);
    }
});

// follow Data

//----------------------------------------------------------------------------------


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



