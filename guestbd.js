const guestData = [
    { email: "lilia.ribac@mail.ru", fname: "Lilia", lname: "Ribac", notes: "Be happy" }
 ];

 let db;

function initDatabase() {
 
    //create a unified variable for the browser variant
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        //if a variant wasn't found, let the user know
    if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB.")
    }

   //attempt to open the database
    let request = window.indexedDB.open("guests", 1);
    request.onerror = function(event) {
        console.log(event);
    };

   //map db to the opening of a database
    request.onsuccess = function(event) { 
        db = request.result;
        console.log("success: " + db);
    };

   //if no database, create one and fill it with data
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("guest", {keyPath: "email"});
      
      for (var i in guestData) {
         objectStore.add(guestData[i]);
      }
   }
}

//adds a record as entered in the form
function add() {
    //get a reference to the fields in html
    let fname = document.querySelector("#fname").value;
    let lname = document.querySelector("#lname").value;
    let email = document.querySelector("#email").value;
    let notes = document.querySelector("#notes").value;

    //alert(id + name + email + age);
   
   //create a transaction and attempt to add data
    var request = db.transaction(["guest"], "readwrite")
    .objectStore("guest")
    .add({ fname: fname, lname: lname, email: email, notes:notes });

   //when successfully added to the database
    request.onsuccess = function(event) {
        console.log(`${fname} has been added to your database.`);
    };

   //when not successfully added to the database
    request.onerror = function(event) {
    alert(`Unable to add data\r\n${fname} is already in your database! `);
    }
    readAll();
}

//not used in code example
//reads one record by id
function read() {
   //get a transaction
   var transaction = db.transaction(["guest"]);
   
   //create the object store
   var objectStore = transaction.objectStore("guest");

   //get the data by id
   var request = objectStore.get("lilia.ribac@mail.ru");
   
   request.onerror = function(event) {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result) {
         alert("First Name: " + request.result.fname + ", Last Name: " + request.result.lname + ", Email: " + request.result.email + ", notes:" +request.result.notes);
      }
      
      else {
         alert("Kenny couldn't be found in your database!");
      }
   };
}

//reads all the data in the database
function readAll() {
    clearList();
   var objectStore = db.transaction("guest").objectStore("guest");
   
   //creates a cursor which iterates through each record
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
        console.log("First Name: " + cursor.value.fname + ", Email: " + cursor.value.email);
        addEntry(cursor.value.fname, cursor.value.lname,       cursor.value.email, cursor.value.notes);
        cursor.continue();
     }
     
     else {
        console.log("No more entries!");
     }
  };
}

//deletes a record by id
function remove() {
    let delid = document.querySelector("#delid").value;
   var request = db.transaction(["guest"], "readwrite")
   .objectStore("guest")
   .delete(delid);
   
   request.onsuccess = function(event) {
      alert("Entry has been removed from your database.");
   };
}

initDatabase();

function addEntry(fname, lname, email, notes) {
    // Your existing code unmodified...
   var iDiv = document.createElement('div');
   iDiv.className = 'entry';
   iDiv.innerHTML = fname + " " + lname + " " + email + "<BR>" + notes + "<HR>";
   document.querySelector("#entries").appendChild(iDiv);
}
function clearList() {
    document.querySelector("#entries").innerHTML = "";
}

initDatabase();