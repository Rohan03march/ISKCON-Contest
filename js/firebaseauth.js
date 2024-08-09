import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged ,sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc,getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Function to generate a referral code
const generateReferralCode = () => {
    return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    const phoneNo = document.getElementById('phoneNo').value;
    const referralCode = document.getElementById('referralCode').value; // Referral code input

    try {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const newReferralCode = generateReferralCode(); // Generate new referral code

        // Set user data
        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNo: phoneNo,
            isLoggedIn: true,
            referralCode: newReferralCode,
            points: 0,
            referredBy: referralCode // Store the referral code here
        };

        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, userData);

        // Update points if referral code exists
        await updateReferralPoints(referralCode, docRef);

        showMessage('Account Created Successfully', 'signUpMessage');
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Error signing up: ", error);
        showMessage('The User already exists', 'signUpMessage');
    }
});








// Sign In Event Listener
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showMessage('Login is Successful', 'signInMessage');
        const user = userCredential.user;

        // Retrieve user data
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const referralCode = userSnapshot.data().referralCode;

            // Store the user ID and referral code in localStorage
            localStorage.setItem('loggedInUserId', user.uid);
            localStorage.setItem('referralCode', referralCode);

            window.location.href = 'index2.html';
        } else {
            console.error('No such document!');
            showMessage('User document does not exist in Firestore', 'signInMessage');
        }
    } catch (error) {
        console.error('Sign-in error:', error.message);
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found') {
            showMessage('Incorrect Email or Password', 'signInMessage');
        } else {
            showMessage('An error occurred during sign-in', 'signInMessage');
        }
    }
});

 /*Sign Out Event Listener
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            localStorage.removeItem('loggedInUserId');
            showMessage('Successfully Logged Out', 'signInMessage');
            window.location.href = 'login.html'; // Redirect to 
             page or desired location
        })
        .catch((error) => {
            console.error('Error Signing Out: ', error);
        });
});*/


const ForgotPassLabel = document.getElementById('forgotpasslabel');

const ForgotPassowrd = () => {
    sendPasswordResetEmail (auth, email.value)
    .then(()=> {
        alert("Password reset as been sent to your mail.")
    })
    .catch ((error) => {
        console.log(error.code);
        console.log(error.message);
    })
}

ForgotPassLabel.addEventListener('click', ForgotPassowrd );



/*
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read,write: if true;
    }
  }
}
*/ 


async function updateReferralPoints(referralCode, userDocRef) {
    if (!referralCode) {
        console.log('No referral code provided.');
        return; // Exit if there's no referral code
    }

    try {
        // Reference to the referrer's document
        const referrerDocRef = doc(db, "users", referralCode);
        const referrerSnapshot = await getDoc(referrerDocRef);

        if (referrerSnapshot.exists()) {
            // Update referrer's points
            const referrerData = referrerSnapshot.data();
            const newPoints = (referrerData.points || 0) + 10;

            await setDoc(referrerDocRef, {
                points: newPoints
            }, { merge: true });

            console.log('Referral points awarded successfully');
        } else {
            console.log('Invalid referral code:', referralCode);
        }
    } catch (error) {
        console.error('Error updating referral points:', error);
    }
}

