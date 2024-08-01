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

// Function to copy message to clipboard and update user shares
document.getElementById('copyLink').addEventListener('click', async () => {
    try {
        // Update user shares count in Firestore (assuming userId is defined somewhere)
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            shares: increment(1)
        });

        // Define the message to be copied
        const url = "https://iskcon-contest.netlify.app/";
        const message = `Hare Krishna! Welcome to the contest. Your friend has sent you this message to participate. ${url}`;

        // Copy message to clipboard
        const shareText = document.getElementById('shareText');
        shareText.value = message; // Set the message into the input
        shareText.select();
        document.execCommand('copy');
        alert("Message copied!");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
});

document.getElementById('sbutton1').addEventListener('click',async() => {
    try {
        const userRef = doc(db,"users",userId);
        await updateDoc(userRef, {
            points: increment(10)
        });
        updateScoreDisplay();
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
        updateScoreDisplay();
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
        updateScoreDisplay();
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
        updateScoreDisplay();
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
        updateScoreDisplay();
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
        updateScoreDisplay();
    } catch (error) {
        console.error("Error",error);
    }
});

// Define the different share URLs for each platform
const shareUrls = {
    whatsapp: "https://api.whatsapp.com/send?text=",
    facebook: "https://www.facebook.com/sharer/sharer.php?u=",
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
          updateScoreDisplay();
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
document.getElementById('copyLink3').addEventListener('click', () => handleShare('facebook'));
document.getElementById('copyLink4').addEventListener('click', () => handleShare('linkedin'));

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




// Function to update the score display
async function updateScoreDisplay() {
    try {
        // Ensure that userId is properly set before attempting to fetch data
        if (!userId) {
            console.error("User ID is not set.");
            return;
        }

        const userRef = doc(db, "users", userId);
        const docSnapshot = await getDoc(userRef);
        
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const points = userData.points || 0;  // Default to 0 if points is not set
            const shares = userData.shares || 0;  // Default to 0 if shares is not set

            // Update the score display
            document.getElementById('score').innerText = `Points ${points} | Shares ${shares}`;
        } else {
            console.warn("No such document! Check if the document exists.");
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
}

// Call the function to update the score display when the page loads
document.addEventListener('DOMContentLoaded', updateScoreDisplay);

