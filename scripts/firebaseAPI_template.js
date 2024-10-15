//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyB1nx0_YkYcTJavi5YbVCtxRkmRTRG4sew",
    authDomain: "comp1800-demo-8bbda.firebaseapp.com",
    projectId: "comp1800-demo-8bbda",
    storageBucket: "comp1800-demo-8bbda.appspot.com",
    messagingSenderId: "976567663495",
    appId: "1:976567663495:web:98c81700ff52b1efe3f122"
  };

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
