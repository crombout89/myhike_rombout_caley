function writeHikes() {
  //define a variable for the collection you want to create in Firestore to populate data
  var hikesRef = db.collection("hikes");

  hikesRef.add({
    code: "BBY01",
    name: "Burnaby Lake Park Trail", //replace with your own city?
    city: "Burnaby",
    province: "BC",
    level: "easy",
    details: "A lovely place for lunch walk",
    length: 10, //number value
    hike_time: 60, //number value
    lat: 49.2467097082573,
    lng: -122.9187029619698,
    last_updated: firebase.firestore.FieldValue.serverTimestamp(), //current system time
  });
  hikesRef.add({
    code: "AM01",
    name: "Buntzen Lake Trail", //replace with your own city?
    city: "Anmore",
    province: "BC",
    level: "moderate",
    details: "Close to town, and relaxing",
    length: 10.5, //number value
    hike_time: 80, //number value
    lat: 49.3399431028579,
    lng: -122.85908496766939,
    last_updated: firebase.firestore.Timestamp.fromDate(
      new Date("March 10, 2022")
    ),
  });
  hikesRef.add({
    code: "NV01",
    name: "Mount Seymour Trail", //replace with your own city?
    city: "North Vancouver",
    province: "BC",
    level: "hard",
    details: "Amazing ski slope views",
    length: 8.2, //number value
    hike_time: 120, //number value
    lat: 49.38847101455571,
    lng: -122.94092543551031,
    last_updated: firebase.firestore.Timestamp.fromDate(
      new Date("January 1, 2023")
    ),
  });
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("hikeCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate"

  db.collection(collection)
    .get() // The collection called "hikes"
    .then((allHikes) => {
      allHikes.forEach((doc) => {
        // Iterate through each document
        var title = doc.data().name; // Get value of the "name" key
        var details = doc.data().details; // Get value of the "details" key
        var hikeCode = doc.data().code; // Get unique ID for fetching the right image
        var hikeLength = doc.data().length; // Gets the length field
        var docID = doc.id;

        let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card

        // Update title, text, and image
        newcard.querySelector(".card-title").innerHTML = title;
        newcard.querySelector(".card-length").innerHTML = hikeLength + " km";
        newcard.querySelector(".card-text").innerHTML = details;
        newcard.querySelector(".card-image").src = `./images/${hikeCode}.jpg`; // Example: NV01.jpg
        newcard.querySelector("a").href = "eachHike.html?docID=" + docID;

        // Add unique id to the icon <i> tag
        let icon = newcard.querySelector("i"); // Assuming the <i> tag is present in your template
        icon.id = "save-" + docID; // Set a unique ID for the icon

        // Add onclick event to the icon <i> tag
        icon.onclick = () => saveBookmark(docID); // Call saveBookmark with the docID

        // Attach to gallery, Example: "hikes-go-here"
        document.getElementById(collection + "-go-here").appendChild(newcard);
      });
    });
}

displayCardsDynamically("hikes"); // Input param is the name of the collection

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version.
//-----------------------------------------------------------------------------
function saveBookmark(hikeDocID) {
  // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
  currentUser.get().then((userDoc) => {
    const bookmarks = userDoc.data().bookmarks;
    if (bookmarks.includes(hikeDocID)) {
        currentUser.update({
            bookmarks: firebase.firestore.FieldValue.arrayRemove(hikeDocID),
        })
        .then(function () {
            console.log("bookmark has been saved for" + hikeDocID);
            let iconID = "save-" + hikeDocID;
            //console.log(iconID);
            //this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = "bookmark_border";
          });
    } else {
      currentUser
        .update({
          // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
          // This method ensures that the ID is added only if it's not already present, preventing duplicates.
          bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeDocID),
        })

        // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
        .then(function () {
          console.log("bookmark has been saved for" + hikeDocID);
          let iconID = "save-" + hikeDocID;
          //console.log(iconID);
          //this is to change the icon of the hike that was saved to "filled"
          document.getElementById(iconID).innerText = "bookmark";
        });
    }
  });
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It removes the hike from the "bookmarks" array
// Then it will change the bookmark icon from the solid to the hollow version.
//-----------------------------------------------------------------------------
function removeBookmark(hikeDocID) {
  // Manage the backend process to remove the hikeDocID from the database.
  currentUser
    .update({
      // Use 'arrayRemove' to remove the bookmark ID from the 'bookmarks' array.
      // This method ensures that the ID is removed if it exists.
      bookmarks: firebase.firestore.FieldValue.arrayRemove(hikeDocID),
    })
    .then(function () {
      // Handle the front-end update to change the icon, providing visual feedback to the user.
      console.log("Bookmark has been removed for " + hikeDocID);
      let iconID = "save-" + hikeDocID;
      // Change the icon of the hike that was removed to "outline"
      document.getElementById(iconID).innerText = "bookmark_border";
    })
    .catch(function (error) {
      console.error("Error removing bookmark:", error);
    });
}
