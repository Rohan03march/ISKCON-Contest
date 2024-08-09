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

// Consolidate user authentication and data display
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
        localStorage.setItem('loggedInUserId', userId); // Ensure localStorage is updated
        
        // Fetch and display user details
        const docRef = doc(db, "users", userId);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText = userData.firstName || "N/A";
                document.getElementById('loggedUserEmail').innerText = userData.email || "N/A";
                document.getElementById('loggedUserLName').innerText = userData.lastName || "N/A";
                updateScoreDisplay();
            } else {
                console.log("No document found matching id");
            }
        } catch (error) {
            console.log("Error getting document:", error);
        }
    } else {
        // Redirect to login page if user is not authenticated
        window.location.href = 'login.html';
    }
});

// Function to update the score display
async function updateScoreDisplay() {
    try {
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
            const answerPoints = userData.AnswerPoints || 0;

            document.getElementById('score').innerText = `Points ${points+answerPoints} | Shares ${shares}`;
        } else {
            console.warn("No such document! Check if the document exists.");
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
}

// Add event listeners for buttons
document.getElementById('copyLink').addEventListener('click', async () => {
    try {
        if (!userId) return;

        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { shares: increment(10) });

        const url = "https://iskcon-contest.netlify.app/";
        const message = `Hare Krishna! Welcome to the contest. Your friend has sent you this message to participate. ${url}`;

        const shareText = document.getElementById('shareText');
        shareText.value = message;
        shareText.select();
        document.execCommand('copy');
        alert("Message copied!");
    } catch (error) {
        console.error("Error updating document:", error);
    }
});

document.getElementById('submit-btn').addEventListener('click', async () => {
    try {
        if (!userId) return;

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const currentPoints = userData.Points || 0;
            const totalPoints = userRoundsPoints.reduce((total, roundPoints) => total + roundPoints, 0);

            if (totalPoints >= 100) {
                // Calculate new points, ensuring it does not exceed 100
                const newPoints = Math.min(currentPoints + totalPoints, 100);

                await updateDoc(userRef, { AnswerPoints: newPoints });
                console.log(`Points updated to ${newPoints}`);
            } else {
                console.log("Total points are less than 100. No update.");
            }
        } else {
            console.log("User does not exist.");
        }
    } catch (error) {
        console.error("Error updating document:", error);
    }
});




const pointButtons = ['sbutton1', 'sbutton2', 'sbutton3', 'sbutton4', 'sbutton5', 'sbutton6'];
pointButtons.forEach(buttonId => {
    document.getElementById(buttonId).addEventListener('click', async () => {
        try {
            if (!userId) return;

            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.exists() ? userDoc.data() : {};
            const currentPoints = userData.points || 0;
            const pressedButtons = userData.pressedButtons || [];

            // Check if the button has already been pressed
            if (pressedButtons.includes(buttonId)) {
                console.log(`Button ${buttonId} has already been pressed.`);
                return;
            }

            if (currentPoints < 60) {
                // Calculate the new points value, which should not exceed 60
                const newPoints = Math.min(currentPoints + 10, 60);

                // Update the document with the new points value and add the button ID to pressedButtons
                await updateDoc(userRef, {
                    points: newPoints,
                    pressedButtons: [...pressedButtons, buttonId]
                });

                updateScoreDisplay();
            } else {
                console.log("Cannot increment points. Maximum of 60 points reached.");
            }
        } catch (error) {
            console.error("Error updating points:", error);
        }
    });
});



// Share URL function
const shareUrls = {
    whatsapp: "https://api.whatsapp.com/send?text=",
    facebook: "https://www.facebook.com/sharer/sharer.php?u=",
    linkedin: "https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=",
    twitter: "https://twitter.com/intent/tweet?text="
};

async function handleShare(platform) {
    try {
        if (!userId) return;

        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { shares: increment(10) });
        updateScoreDisplay();

        const url = "https://iskcon-contest.netlify.app/";
        const message = `Join me on ISKCON Contest to win some Exciting Prizes. Create your account by using this link here: ${url}`;
        const encodedMessage = encodeURIComponent(message);
        const shareUrl = shareUrls[platform] + encodedMessage;

        window.open(shareUrl, '_blank');
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

document.getElementById('copyLink1').addEventListener('click', () => handleShare('whatsapp'));
document.getElementById('copyLink3').addEventListener('click', () => handleShare('facebook'));
document.getElementById('copyLink4').addEventListener('click', () => handleShare('linkedin'));

// Ensure updateScoreDisplay is called when the page is loaded
document.addEventListener('DOMContentLoaded', updateScoreDisplay);





document.getElementById('copy-button').addEventListener('click', async () => {
    try {
        if (!userId) return;

        // Notify the user that the message is copied
        alert("Message copied!");

        // Immediately update shares in the database
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { shares: increment(10) });
        console.log("Shares updated in the database.");

        // Show loading message
        const loadingMessage = document.getElementById('loading-message');
        loadingMessage.style.display = 'block';

        // Delay the display update by 5 minutes (300,000 milliseconds)
        setTimeout(async () => {
            try {
                // Fetch the updated user data after delay
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    // Update the HTML to show the new share count and points
                    const points = userData.points || 0;
                    const shares = userData.shares || 0;
                    document.getElementById('score').innerHTML = `Points: ${points} | Shares: ${shares}`;
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching updated data:", error);
            } finally {
                // Hide loading message
                loadingMessage.style.display = 'none';
            }
        }, 300000); // Delay of 5 minutes
    } catch (error) {
        console.error("Error processing click event:", error);
    }
});




async function updateReferralPoints(referralCode, userDocRef) {
    if (!referralCode) return; // Exit if there's no referral code

    // Reference to the referrer's document
    const referrerDocRef = doc(db, "users", referralCode);
    const referrerSnapshot = await getDoc(referrerDocRef);

    if (referrerSnapshot.exists()) {
        // Update referrer's points
        await updateDoc(referrerDocRef, {
            referral_points: referrerSnapshot.data().points + 10
        });
        
        // Update new user's points
        await updateDoc(userDocRef, {
            referral_points: (await getDoc(userDocRef)).data().points + 10
        });
    }
}



async function checkQuizCompletion(userId) {
    try {
        const userDoc = doc(db, "users", userId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
            return userSnap.data().quizCompleted || false;
        } else {
            // Create a new document if it does not exist
            await setDoc(userDoc, { quizCompleted: false, points: 0 });
            return false; // Quiz is not completed
        }
    } catch (error) {
        console.error("Error checking quiz completion:", error);
        return false;
    }
}

