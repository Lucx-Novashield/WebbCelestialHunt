import './style.css';
import Phaser from 'phaser';

// Get the popup and the button
const popup = document.getElementById("popup");
const openPopupBtn = document.getElementById("inventario");
const closePopupBtn = document.getElementById("closePopupBtn");
const openNvl1 = document.getElementById("one");
const openNvl2 = document.getElementById("two");
const openNvl3 = document.getElementById("three");
const openNvl4 = document.getElementById("four");
const nvl1 = document.getElementById("nvl1");
const nvl2 = document.getElementById("nvl2");
const nvl3 = document.getElementById("nvl3");
const nvl4 = document.getElementById("nvl4");
const nvlbg = document.getElementById("nivelesbg");
const nvls = document.getElementById("nvls");

// When the user clicks the button, open the popup
openPopupBtn.onclick = function() {
    popup.style.display = "block";
}

// When the user clicks the close button, close the popup
closePopupBtn.onclick = function() {
    popup.style.display = "none";
}

// Close the popup if the user clicks outside of the popup content
window.onclick = function(event) {
    if (event.target === popup) {
        popup.style.display = "none";
    }
}

// Function to show the specified canvas and hide others

