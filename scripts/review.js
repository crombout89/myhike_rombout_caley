document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const hikeDocID = urlParams.get('docID');

    // Initialize Firestore
    const db = firebase.firestore();

    // Fetch hike data using hikeDocID
    db.collection('hikes').doc(hikeDocID).get().then((doc) => {
        if (doc.exists) {
            const hikeData = doc.data();
            document.getElementById("hikeName").textContent = hikeData.name; // Set the hike name in the span
        } else {
            console.error("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });

    // Function to submit the review
    window.writeReview = function() {
        const title = document.getElementById("title").value;
        const rating = document.getElementById("rating").value;
        const level = document.getElementById("level").value;
        const season = document.getElementById("season").value;
        const description = document.getElementById("description").value;
        const flooded = document.querySelector('input[name="flooded"]:checked').value;
        const scrambled = document.querySelector('input[name="scrambled"]:checked').value;

        // Validate the required fields
        if (!title || !description) {
            alert("Please fill in all required fields.");
            return;
        }

        // Save the review to Firestore
        db.collection('reviews').add({
            hikeDocID: hikeDocID,
            title: title,
            rating: rating,
            level: level,
            season: season,
            description: description,
            flooded: flooded,
            scrambled: scrambled,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Review submitted successfully!");
            // Optionally clear the form or redirect
            document.getElementById("reviewForm").reset();
        }).catch((error) => {
            console.error("Error submitting review:", error);
        });
    };

    // Function to handle rating clicks
    window.rate = function(star) {
        // Set the rating value
        document.getElementById("rating").value = star;

        // Update star display
        for (let i = 1; i <= 5; i++) {
            const starElement = document.getElementById(`star${i}`);
            starElement.textContent = i <= star ? "star" : "star_outline"; // Fill or outline star
        }
    };
});