import './style.css';
import Phaser, { Game } from 'phaser';

const sizes = {
    width: 1500,
    height: 700,
};

const colors = [0Xb84f25, 0Xbba79c, 0x363c66, 0X729abf]; //orange, white, dark blue, blue
const shadowC = [0Xe68863, 0Xe8dfda, 0X585f8c, 0X98b8d6, 0xffffff];
let colorsN = 0;

function isPositionValid(newX, newY, existingDots, minDistance) {
    for (let dot of existingDots) {
        let distance = Phaser.Math.Distance.Between(newX, newY, dot.x, dot.y);
        if (distance < minDistance) {
            return false; 
        }
    }
    return true;
}

const sounds = {
    red: ['do', 're', 'mi', 'fa'],  // Sounds for red phase
    green: ['sol', 'la', 'si', 'do2'],  // Sounds for green phase
    blue: ['re2', 'mi2', 'fa2', 'sol2'],  // Sounds for blue phase
    yellow: ['la2', 'si2', 'do3', 're3']  // Sounds for yellow phase
};

let currentSoundSet = sounds.red;  // Start with the red sound set

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.dots = [];
        this.sequence = [];
        this.playerInput = [];
        this.currentStep = 0;
        this.parts = 1;
        this.lol = 0;
    }

    preload() {
        // Preload all sounds
        this.load.audio('do', '/sounds/do.mp3');
        this.load.audio('re', '/sounds/re.mp3');
        this.load.audio('mi', '/sounds/mi.mp3');
        this.load.audio('fa', '/sounds/fa.mp3');
        this.load.audio('sol', '/sounds/sol.mp3');
        this.load.audio('la', '/sounds/la.mp3');
        this.load.audio('si', '/sounds/si.mp3');
        this.load.audio('do2', '/sounds/do2.mp3');
        this.load.audio('re2', '/sounds/re2.mp3');
        this.load.audio('mi2', '/sounds/mi2.mp3');
        this.load.audio('fa2', '/sounds/fa2.mp3');
        this.load.audio('sol2', '/sounds/sol2.mp3');
        this.load.audio('la2', '/sounds/la2.mp3');
        this.load.audio('si2', '/sounds/si2.mp3');
        this.load.audio('do3', '/sounds/do3.mp3');
        this.load.audio('re3', '/sounds/re3.mp3');
        this.load.image('bg', '/images/bg.png');
    }

    create() {
      this.add.image(0, 0, "bg").setOrigin(0, 0);
        for (let i = 0; i < 4; i++) {
            let positionY, positionX;
            let isValidPosition = false;

            while (!isValidPosition) {
                positionY = Phaser.Math.Between(100, sizes.height - 200);
                positionX = Phaser.Math.Between(100, sizes.width - 250);
                isValidPosition = isPositionValid(positionX, positionY, this.dots, 250);
            }

            let dot = this.add.circle(positionX, positionY, 25, colors[colorsN]);
            dot.setInteractive();

            dot.on('pointerover', () => {
                dot.setFillStyle(shadowC[colorsN]);
            });

            dot.on('pointerout', () => {
                dot.setFillStyle(colors[colorsN]);
            });

            dot.on('pointerdown', () => {
                this.handleDotClick(i);
            });

            this.dots.push(dot);
        }

        // Start the sequence
        this.startSequence();
    }

    startSequence() {
        this.sequence = []; 
        for (let i = 0; i < 4; i++) {
            this.sequence.push(Phaser.Math.Between(0, 3)); 
        }

        // Show the sequence
        this.showSequence();
    }

    showSequence() {
        let delay = 1500;
        this.currentStep = 0;
        this.lightUpNextDot(0, delay);
    }

    lightUpNextDot(stepIndex, delay) {
        if (stepIndex >= this.sequence.length) {
            return;
        }

        let dotIndex = this.sequence[stepIndex];
        let dot = this.dots[dotIndex];
        let originalColor = colors[colorsN];

        dot.setFillStyle(shadowC[colorsN]);

        this.time.delayedCall(300, () => {
            dot.setFillStyle(originalColor);

            // Play the corresponding sound in the sequence
            this.playSound(dotIndex);

            // Wait before lighting up the next dot
            this.time.delayedCall(delay - 300, () => {
                this.lightUpNextDot(stepIndex + 1, delay);
            });
        });
    }

    playSound(index) {
        // Get the corresponding sound from the current sound set and play it
        let soundKey = currentSoundSet[index];
        this.sound.play(soundKey);
    }

    handleDotClick(index) {
        // Play the sound associated with the clicked dot
        this.playSound(index);
        
        this.playerInput.push(index);

        if (this.playerInput[this.currentStep] === this.sequence[this.currentStep]) {
            this.currentStep++;

            if (this.currentStep === this.sequence.length) {
                console.log("You won!");
                this.time.delayedCall(500, () => {
                    this.partsChange();
                });
            }
        } else {
            // If the player clicks the wrong dot, they lose
            console.log("You lost");
            this.scene.start('LoseScene');
            this.playerInput = [];
            this.currentStep = 0;
            this.sequence = [];
            this.dots = [];
        }
    }

    partsChange() {
        this.lol++;
        if (this.lol % 2 == 0) {
            colorsN++;
            currentSoundSet = this.getSoundSet(colorsN); // Change to the next sound set
            this.time.delayedCall(1000, () => {
                this.restartGame();
            });
            this.parts++;
        } else {
            this.time.delayedCall(1000, () => {
                this.restartGame();
            });
        }
    }

    getSoundSet(colorIndex) {
        switch (colorIndex) {
            case 0:
                return sounds.red;
            case 1:
                return sounds.green;
            case 2:
                return sounds.blue;
            case 3:
                return sounds.yellow;
            default:
                return sounds.red; // Default to red sounds
        }
    }

    restartGame() {
        if (this.parts <= 4) {
            this.time.removeAllEvents();

            // Remove old dots
            this.dots.forEach(dot => dot.destroy());

            this.playerInput = [];
            this.currentStep = 0;
            this.sequence = [];
            this.dots = [];

            // Create new dots in random positions
            for (let i = 0; i < 4; i++) {
                let positionY, positionX;
                let isValidPosition = false;

                while (!isValidPosition) {
                    positionY = Phaser.Math.Between(100, sizes.height - 200);
                    positionX = Phaser.Math.Between(100, sizes.width - 250);
                    isValidPosition = isPositionValid(positionX, positionY, this.dots, 200);
                }

                let dot = this.add.circle(positionX, positionY, 25, colors[colorsN]);
                dot.setInteractive();

                dot.on('pointerover', () => {
                    dot.setFillStyle(shadowC[colorsN]);
                });

                dot.on('pointerout', () => {
                    dot.setFillStyle(colors[colorsN]);
                });

                dot.on('pointerdown', () => this.handleDotClick(i));
                this.dots.push(dot);
            }

            // Start the new sequence
            this.startSequence();
        } else {
            this.scene.start('WinScene');
        }
    }
}

class StartScene extends Phaser.Scene{
  constructor(){
    super('StartScene');
  }

  preload(){
    this.load.image('start-bg', '/images/bg.png');
  }

  create() {
    //fade in
    this.cameras.main.fadeIn(1000);

    this.add.image(sizes.width / 2, sizes.height / 2, 'start-bg').setOrigin(0.5);

    const bg2 = this.add.rectangle(750, 350, 600, 400, 0X2A0944, 0.5);
    bg2.setOrigin(0.5); 

    const levelText = this.add.text(750, 200, 'Level 1', {
      fontSize: '32px',
      color: '#FEC260',
      fontFamily: 'Orbitron',
      fontWeight: 500
    });
    levelText.setOrigin(0.5); 

  const instructionsText = this.add.text(475, 240, "Follow the sounds and press the buttons in the right rhythms to load new levels. Good luck!", {
    fontSize: '24px',
    color: '#ffffff',
    fontFamily: 'Exo',
    wordWrap: { width: 575, useAdvancedWrap: true }, 
    align: 'center', 
  })

    const startB = this.add.text(750, 500, 'Start', {
      fontSize: '26px',
      fontFamily: 'Orbitron',
      color: 'white',
      backgroundColor: '#A12568 ',
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setInteractive();
    startB.setOrigin(0.5); 

    //hover effect
    startB.on('pointerover', () => {
      startB.setStyle({ backgroundColor: '#FEC260' }); 
    });

    startB.on('pointerout', () => {
      startB.setStyle({ backgroundColor: '#A12568 ' }); 
    });

    //fade-out
    startB.on('pointerdown', () => {
      this.cameras.main.fadeOut(1000); 
      this.time.delayedCall(1000, () => {
        this.scene.stop('StartScene'); 
        this.scene.start('GameScene'); 
      });
    });

  }
}

class LoseScene extends Phaser.Scene {
  constructor() {
    super('LoseScene');
  }

  preload() {
    this.load.image('lose-bg', '/images/bg.png'); 
  }

  create() {
    //fade in
    this.cameras.main.fadeIn(500);

    this.add.image(sizes.width / 2, sizes.height / 2, 'lose-bg').setOrigin(0.5);

    const bg2 = this.add.rectangle(750, 300, 500, 400, 0x2A0944, 0.5);
    bg2.setOrigin(0.5); 

    const gameOverText = this.add.text(750, 250, "Incorrect", {
      fontSize: '32px',
      fontFamily: 'Orbitron',
      color: '#FEC260'
    });
    gameOverText.setOrigin(0.5); 

    const restartB = this.add.text(750, 350, 'Restart', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Orbitron',
      backgroundColor: '#A12568',
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setInteractive();
    restartB.setOrigin(0.5); 

    restartB.on('pointerover', () => {
      restartB.setStyle({ backgroundColor: '#FEC260' }); 
    });

    restartB.on('pointerout', () => {
      restartB.setStyle({ backgroundColor: '#A12568' }); 
    });


    restartB.on('pointerdown', () => {
      this.cameras.main.fadeOut(1000); 
      this.time.delayedCall(1000, () => {
        this.scene.stop('LoseScene'); 
        this.scene.start('scene-game'); 
      });
    });
  }
}
class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
        this.dialogueBox = null;
        this.dialogueText = null;
        this.currentDialogueIndex = 0;
        this.dialogue = [
            "The SMACS 0723 image, taken by the Webb telescope, shows thousands of distant galaxies, some over 13 billion light-years away.",
            "By using gravitational lensing, which bends light toward a galaxy cluster, Webb could observe even more distant objects.",
            "This allowed scientists to study the chemical composition of the early universe and observe galaxies in formation.",
            "Thanks to the work of JWST, we have gained insights into how stars and cosmic structures evolve.",
            "NASA views this image as key for future discoveries about the universe's origin."
        ];
        this.typingInterval = 20; // Time in milliseconds between characters
        this.isTyping = false; // To check if dialogue is currently being typed
    }
  
    preload() {
        this.load.image('bgW', '/images/star.jpg');
    }
  
    create() {
        const background = this.add.image(0, 0, 'bgW');
        background.setOrigin(0, 0).setScale(0.8);
  
        // Create a semi-transparent black rectangle for the dialogue box
        this.dialogueBox = this.add.graphics();
        this.dialogueBox.fillStyle(0x000000, 0.5); // Semi-transparent black
        this.dialogueBox.fillRect(20, this.cameras.main.height - 150, this.cameras.main.width - 100, 100); // Position and size
  
        // Create text object for the dialogue
        this.dialogueText = this.add.text(60, this.cameras.main.height - 140, '', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: "Exo2",
            wordWrap: { width: this.cameras.main.width - 120 } // Wrap text inside the box
        });
  
        // Start typing the dialogue
        this.typeDialogue();
    }
  
    typeDialogue() {
        if (this.currentDialogueIndex < this.dialogue.length) {
            this.isTyping = true;
            this.dialogueText.setText(''); // Clear previous text
            this.typeCharacter(this.dialogue[this.currentDialogueIndex], 0);
        }
    }
  
    typeCharacter(text, charIndex) {
        if (charIndex < text.length) {
            this.dialogueText.setText(this.dialogueText.text + text[charIndex]);
            this.time.delayedCall(this.typingInterval, () => {
                this.typeCharacter(text, charIndex + 1);
            });
        } else {
            // Dialogue finished typing, prepare to go to WinScene2
            this.isTyping = false;
            this.currentDialogueIndex++;
  
            if (this.currentDialogueIndex < this.dialogue.length) {
                // Add a click event to move to the next dialogue
                this.input.once('pointerdown', () => {
                    this.typeDialogue(); // Start typing the next dialogue
                });
            } else {
                // Last dialogue finished, transition to WinScene2
                this.time.delayedCall(1000, () => {
                    this.scene.start('WinScene2'); // Start the WinScene2 after a delay
                });
            }
        }
    }
  }

class WinScene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene2' });
        
        // Textbox elements (hidden by default)
        this.textbox = null;
        this.titleText = null;
        this.bodyText = null;
    }
  
    preload() {
        this.load.image('bgW', '/images/star.jpg');
    }
  
    create() {
        const background = this.add.image(0, 0, 'bgW');
        background.setOrigin(0, 0).setScale(0.8);
  
        // Create a semi-transparent black rectangle for the dialogue box
        
        // Create circles that open textboxes
        this.createCircle(700, 700, 'Circle 1', 'This is the text for Circle 1.');
        this.createCircle(150, 150, 'Circle 2', 'This is the text for Circle 2.');
        this.createCircle(500, 150, 'Circle 3', 'This is the text for Circle 3.');
  
        // Create the textbox (hidden by default)
        this.createTextbox();
    }
  
    createCircle(x, y, title, paragraph) {
        let circle = this.add.circle(x, y, 10, 0x00ff00).setInteractive();
  
        // Add click event to the circle
        circle.on('pointerdown', () => {
            this.openTextbox(title, paragraph);
        });
    }
  
    createTextbox() {
        this.textbox = this.add.rectangle(400, 300, 400, 200, 0x000000).setOrigin(0.5).setVisible(false);
        this.titleText = this.add.text(400, 250, '', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setVisible(false);
        this.bodyText = this.add.text(400, 300, '', { fontSize: '20px', color: '#ffffff', wordWrap: { width: 380 } }).setOrigin(0.5).setVisible(false);
  
        // Close button (optional)
        const closeButton = this.add.text(700, 220, 'X', { fontSize: '32px', color: '#ffffff' })
            .setInteractive()
            .on('pointerdown', () => this.closeTextbox());
    }
  
    openTextbox(title, paragraph) {
        this.textbox.setVisible(true);
        this.titleText.setText(title).setVisible(true);
        this.bodyText.setText(paragraph).setVisible(true);
    }
  
    closeTextbox() {
        this.textbox.setVisible(false);
        this.titleText.setVisible(false);
        this.bodyText.setVisible(false);
    }
  
    update() {
        // Any update logic goes here
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
        debug: false,
      },
    },
    scene: [ StartScene, GameScene, LoseScene, WinScene] // StartScene is now the first scene
  };

const game = new Phaser.Game(config);

//#ac461d  #bba79c    #3a3f5e   729abf = stars

//2A0944  3B185F   A12568   FEC260 = dark blue, blue, pink, yellow