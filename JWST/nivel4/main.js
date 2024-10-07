import './style.css';
import Phaser from 'phaser';
import { makeDraggable } from '/Users/Vinicio Proaño Salas/Desktop/JWST/nivel4/functions/draggable.js';
import { interactiveF } from './functions/interactiveF';

const sizes = {
  width: 1500,
  height: 700,
};
let selectedObj;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.onscreenImgs = [];
        this.menuVisible = false;  // Control visibility of the menu
        this.menu = null;          // Store reference to the menu
        this.selectedObj = null;   // Store the currently selected object
    }

    preload() {
        // Load images
        this.load.image('supernovas1', '/images/supernovas1.png');
        this.load.image('supernovas2', '/images/supernovas2.png');
        this.load.image('supernovas3', '/images/supernovas3.png');
        this.load.image('clouds1', '/images/clouds1.png');
        this.load.image('clouds2', '/images/clouds2.png');
        this.load.image('clouds3', '/images/clouds3.png');
        this.load.image('blackH1', '/images/blackH1.png');
        this.load.image('blackH2', '/images/blackH2.png');
        this.load.image('blackH3', '/images/blackH3.png');
    }

    create() {
        // Assign keys to this.<key> so they can be used in the update method
        this.growKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.shrinkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.eraseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.rotateKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    
        const margin = 50;
        const spacing = 20;
        const imageWidth = 200;
    
        const totalWidth = (imageWidth * 3) + (spacing * 2);
        const startX = (this.cameras.main.width - totalWidth) / 2 + imageWidth / 2;
        const yPosition = this.cameras.main.height - imageWidth / 2 - 15;
    
        const supernovas = this.add.image(startX, yPosition, 'supernovas1').setInteractive().setScale(0.2);
        const clouds = this.add.image(startX + imageWidth + spacing, yPosition, 'clouds1').setScale(0.3).setInteractive();
        const blackH = this.add.image(startX + (imageWidth + spacing) * 2, yPosition, 'blackH1').setScale(0.2).setInteractive();
    
        // Create the secondary menu container for supernovas
        this.secondaryMenuC1 = this.add.container(startX - 160, yPosition - 175);
        
        let secondaryBg1 = this.add.graphics();
        secondaryBg1.fillStyle(0x000000, 1); // Light grey background
        secondaryBg1.fillRect(0, 0, 300, 100); // Size of the secondary menu background
        this.secondaryMenuC1.add(secondaryBg1);
        
        const s1 = this.add.image(50, 50, 'supernovas1').setScale(0.2).setInteractive();
        const s2 = this.add.image(150, 50, 'supernovas2').setScale(0.03).setInteractive();
        const s3 = this.add.image(250, 50, 'supernovas3').setScale(0.3).setInteractive();
        
        this.secondaryMenuC1.add(s1);
        this.secondaryMenuC1.add(s2);
        this.secondaryMenuC1.add(s3);
        this.secondaryMenuC1.setVisible(false); // Initially hide the secondary menu
    
        // Create the secondary menu container for clouds
        this.secondaryMenuC2 = this.add.container(startX - 160, yPosition - 175);
        
        let secondaryBg2 = this.add.graphics();
        secondaryBg2.fillStyle(0x000000, 1); // Light grey background
        secondaryBg2.fillRect(0, 0, 300, 100); // Size of the secondary menu background
        this.secondaryMenuC2.add(secondaryBg2);
        
        const c1 = this.add.image(50, 50, 'clouds1').setScale(0.2).setInteractive();
        const c2 = this.add.image(150, 50, 'clouds2').setScale(0.03).setInteractive();
        const c3 = this.add.image(250, 50, 'clouds3').setScale(0.3).setInteractive();
        
        this.secondaryMenuC2.add(c1);
        this.secondaryMenuC2.add(c2);
        this.secondaryMenuC2.add(c3);
        this.secondaryMenuC2.setVisible(false); // Initially hide the secondary menu
    
        // Create the secondary menu container for black holes
        this.secondaryMenuC3 = this.add.container(startX - 160, yPosition - 175);
        
        let secondaryBg3 = this.add.graphics();
        secondaryBg3.fillStyle(0x000000, 1); // Light grey background
        secondaryBg3.fillRect(0, 0, 300, 100); // Size of the secondary menu background
        this.secondaryMenuC3.add(secondaryBg3);
        
        const b1 = this.add.image(50, 50, 'blackH1').setScale(0.2).setInteractive();
        const b2 = this.add.image(150, 50, 'blackH2').setScale(0.03).setInteractive();
        const b3 = this.add.image(250, 50, 'blackH3').setScale(0.3).setInteractive();
        
        this.secondaryMenuC3.add(b1);
        this.secondaryMenuC3.add(b2);
        this.secondaryMenuC3.add(b3);
        this.secondaryMenuC3.setVisible(false); // Initially hide the secondary menu
    
        this.imageStorage = this.add.container(100, 100);  
    
        // Add event listener for supernovas
        supernovas.on('pointerdown', () => {
            this.menuVisible = !this.menuVisible;
            this.secondaryMenuC1.setVisible(this.menuVisible);
            this.secondaryMenuC2.setVisible(false);  // Ensure the other menu is hidden
            this.secondaryMenuC3.setVisible(false);  // Ensure the other menu is hidden
        });
    
        // Add event listener for clouds
        clouds.on('pointerdown', () => {
            this.menuVisible = !this.menuVisible;
            this.secondaryMenuC2.setVisible(this.menuVisible);
            this.secondaryMenuC1.setVisible(false);  // Ensure the other menu is hidden
            this.secondaryMenuC3.setVisible(false);  // Ensure the other menu is hidden
        });
    
        // Add event listener for black holes
        blackH.on('pointerdown', () => {
            this.menuVisible = !this.menuVisible;
            this.secondaryMenuC3.setVisible(this.menuVisible);
            this.secondaryMenuC1.setVisible(false);  // Ensure the other menu is hidden
            this.secondaryMenuC2.setVisible(false);  // Ensure the other menu is hidden
        });
    
        // Add click event listeners to the secondary menu images for supernovas
        s1.on('pointerdown', () => this.addImageToStorage('supernovas1'));
        s2.on('pointerdown', () => this.addImageToStorage('supernovas2'));
        s3.on('pointerdown', () => this.addImageToStorage('supernovas3'));
    
        // Add click event listeners to the secondary menu images for clouds
        c1.on('pointerdown', () => this.addImageToStorage('clouds1'));
        c2.on('pointerdown', () => this.addImageToStorage('clouds2'));
        c3.on('pointerdown', () => this.addImageToStorage('clouds3'));
    
        // Add click event listeners to the secondary menu images for black holes
        b1.on('pointerdown', () => this.addImageToStorage('blackH1'));
        b2.on('pointerdown', () => this.addImageToStorage('blackH2'));
        b3.on('pointerdown', () => this.addImageToStorage('blackH3'));
    
        // Add global pointerdown listener to detect clicks outside selected images
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            // Deselect if the click is not on the currently selected object
            if (this.selectedObj && !currentlyOver.includes(this.selectedObj)) {
                this.deselectObject();
            }
        });
    }

    addImageToStorage(imageKey) {
        const newImage = this.add.image(this.imageStorage.width + 50, 50, imageKey).setScale(0.2); // Position inside the container
        this.imageStorage.add(newImage);
        newImage.setInteractive();
        newImage.on('pointerdown', () => {
            this.selectObject(newImage);
        });
    }

    selectObject(gameObject) {
        if (this.selectedObj) {
            this.deselectObject();
        }

        this.selectedObj = gameObject;
        this.selectedObj.setTint(0xff0000);
        makeDraggable(this.selectedObj, true);
    }

    deselectObject() {
        if (this.selectedObj) {
            this.selectedObj.clearTint(); 
            this.selectedObj = null;      
        }
    }

    update() {
        if (this.selectedObj) {
            // Check for the grow key press (M)
            if (Phaser.Input.Keyboard.JustDown(this.growKey)) {
                if (this.selectedObj.scaleX < 2) {
                    this.selectedObj.setScale(this.selectedObj.scaleX + 0.1, this.selectedObj.scaleY + 0.1);
                }
            }
            // Check for the shrink key press (S)
            if (Phaser.Input.Keyboard.JustDown(this.shrinkKey)) {
                if (this.selectedObj.scaleX >= 0.1) {
                    this.selectedObj.setScale(this.selectedObj.scaleX - 0.1, this.selectedObj.scaleY - 0.1);
                }
            }
            // Check for the rotate key press (R)
            if (Phaser.Input.Keyboard.JustDown(this.rotateKey)) {
                this.selectedObj.angle += 45;
            }
            // Check for the erase key press (E)
            if (Phaser.Input.Keyboard.JustDown(this.eraseKey)) {
                this.selectedObj.destroy(); // Erase the selected object
                this.selectedObj = null;    // Deselect after deletion
            }
        }
    }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [GameScene] // StartScene is now the first scene
};

const game = new Phaser.Game(config);