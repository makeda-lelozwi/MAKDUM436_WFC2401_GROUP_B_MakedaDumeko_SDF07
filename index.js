/*New Methods:
  - initialise app
  - onValue (has call-back to a snapshot)


  JS Concepts
  - multidimensional arrays
  - know diff. // object entries, object value and object key
  - snapshot = screenshot at a point in time of the info on the database that you might want to use
  - empty string 
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//an object
const appSettings = {
  databaseURL: "https://realtime-database-62fa4-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

//DOM - referencing HTML
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")


//                            event-type, callback function
addButtonEl.addEventListener("click", function() {
  let inputValue = inputFieldEl.value

  push(shoppingListInDB, inputValue)

  //utility function
  clearInputFieldEl()
  //removing this line fixes the duplication bug
  // appendItemToShoppingListEl(inputValue) 
})

//detects any changes to our database 

onValue(shoppingListInDB, function(snapshot) {
  if (snapshot.exists()) {

    let itemsArray = Object.entries(snapshot.val())
    //this will convert an object into an array
    // 0      ,     1
    //[[T,B,C][12, 13, 14]]
    //need a for loop to be able to look into the array
    
    clearShoppingListEl()

    //new bug: duplication of last added shoppingItem

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]

      let currentItemID = currentItem[0]
      let currentItemValue = currentItem[1]

      appendItemToShoppingListEl(currentItem)
    }
  } else {
    shoppingListEl.innerHTML = "No items here...yet."
  }
})

function clearShoppingListEl() {
  shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
  inputFieldEl.value = ""
}
//append is more on DOM manipulation side 
//rendering information on the screen
function appendItemToShoppingListEl(item) {
  /* we need to refactor: 
    shoppingListEl.innerHTML += `<li>${itemValue}</li>` 
    because we can't add an event listener to each of the 
    shopping list items so we can run a function (delete) when the
    user clicks those items 
  */
  let itemID = item[0]
  let itemValue = item[1]
  
  let newEl = document.createElement("li")

  newEl.textContent = itemValue

  //adding the event listener 
  newEl.addEventListener("click", function() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`) 

    remove(exactLocationOfItemInDB)
  })

  shoppingListEl.append(newEl)
} 
