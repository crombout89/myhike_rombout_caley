document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const hikeDocID = urlParams.get('docID');

    // Fetch hike data from Firestore using hikeDocID
    const db = firebase.firestore();
    db.collection('hikes').doc(hikeDocID).get().then((doc) => {
        if (doc.exists) {
            const hikeData = doc.data();
            document.getElementById("hikeName").textContent = hikeData.name; // Set the hike name
            document.querySelector(".hike-img").src = `images/${hikeData.code}.jpg`; // Set the hike image URL
            document.querySelector(".hike-length").textContent = hikeData.length; // Set the hike length
            document.querySelector(".hike-level").textContent = hikeData.level; // Set the hike level
            document.querySelector(".hike-description").textContent = hikeData.details; // Set the hike details
        } else {
            console.error("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });

    // Add event listener for the Write Review button
    document.getElementById("writeReviewButton").addEventListener("click", function() {
        // Redirect to the review page
        window.location.href = `review.html?docID=${hikeDocID}`;
    });
});