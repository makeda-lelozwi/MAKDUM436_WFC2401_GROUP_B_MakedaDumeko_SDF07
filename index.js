import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://realtime-database-62fa4-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
  let inputValue = inputFieldEl.value

  push(shoppingListInDB, inputValue)

  clearInputFieldEl()
  //removing this line fixes the duplication bug
  // appendItemToShoppingListEl(inputValue) 
})

onValue(shoppingListInDB, function(snapshot) {
  //using the Object to turn the snapshot into an array so that we can run a for loop on it
  let itemsArray = Object.values(snapshot.val())
  
  clearShoppingListEl()
  

  //new bug: duplication of last added shoppingItem

  for (let i = 0; i < itemsArray.length; i++) {
    appendItemToShoppingListEl(itemsArray[i])
  }
})

function clearShoppingListEl() {
  shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
  inputFieldEl.value = ""
}

function appendItemToShoppingListEl(itemValue) {
  shoppingListEl.innerHTML += `<li>${itemValue}</li>`
} 