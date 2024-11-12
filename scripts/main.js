// Global variable pointing to the current user's Firestore document
var currentUser;   

// Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); // global
            console.log(currentUser);

            // Figure out what day of the week it is today
            const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const d = new Date();
            let day = weekday[d.getDay()];

            // The following functions are always called when someone is logged in
            readQuote(day); // This will read the quote for the current day
            insertNameFromFirestore(); // This will insert the name from Firestore
            displayCardsDynamically("hikes");
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}

doAll();

// Displays the quote based on input param string "tuesday", "monday", etc. 
function readQuote(day) {
    db.collection("quotes").doc(day).onSnapshot(doc => {
        console.log("inside");
        console.log(doc.data());
        document.getElementById("quote-goes-here").innerHTML = doc.data().quote;
    });
}

// Insert name function using the global variable "currentUser"
function insertNameFromFirestore() {
    currentUser.get().then(userDoc => {
        // Get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); // jQuery
        // document.getElementById("name-goes-here").innerHTML = user_Name; // Alternative using vanilla JS
    });
}

// Comment out the next line (we will call this function from doAll())
// insertNameFromFirestore(); // This line is now commented out