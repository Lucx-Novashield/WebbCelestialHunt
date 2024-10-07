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
function showLevelCanvas(level) {
    nvlbg.style.display = "none";
    nvl1.style.display = "none";
    nvl2.style.display = "none";
    nvl3.style.display = "none";
    nvl4.style.display = "none";
    level.style.display = "flex";
}

// Event listeners to show the specific canvas
//openNvl1.addEventListener("click", () => showLevelCanvas(nvl1));
//openNvl2.addEventListener("click", () => showLevelCanvas(nvl2));
openNvl3.addEventListener("click", () => showLevelCanvas(nvl3));
openNvl4.addEventListener("click", () => showLevelCanvas(nvl4));

// Phaser configuration and scenes




class GameScene1 extends Phaser.Scene {
    constructor() {
        super("scene-game");
    }

    preload() {
        // Load any assets needed for the scene here
    }

    create() {
        // Add a button to return to the main screen
        const returnButton = this.add.text(50, 50, 'Return to Main Screen', { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
                // Show the main screen and hide the game canvas
                nvlbg.style.display = "block";
                nvl1.style.display = "none"; // Hide current scene's canvas
                nvl2.style.display = "none"; // If you have other canvases to hide
                nvl3.style.display = "none";
                nvl4.style.display = "none";
            });
    }
}

// Example of adding another scene
class AnotherGameScene extends Phaser.Scene {
    constructor() {
        super("another-scene");
    }

    preload() {
        // Load assets for this scene
    }

    create() {
        // Add scene-specific content
        /*const returnButton = this.add.text(100, 50, 'Return to Main Screen', { font:'Helvetica 25px', fill:'white' })
            .setInteractive()
            .on('pointerdown', () => {
                // Show the main screen and hide the current canvas
                nvlbg.style.display = "block";
                nvl1.style.display = "none";
                nvl2.style.display = "none";
                nvl3.style.display = "none";
                nvl4.style.display = "none";
            });*/
    }
    
}
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [GameScene1], // Add other scenes as needed
    parent: 'phaser-game-container' // Make sure this matches the ID of your container element if you have one
};

const game = new Phaser.Game(config); 