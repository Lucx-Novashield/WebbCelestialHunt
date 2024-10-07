import './style.css';
import Phaser from 'phaser';

const sizes = {
  width: 1500,
  height: 700,
};
const marg = 250;

const acc = 600;
const drag = 500; 

document.fonts.ready.then(function () {
  // Now the font is available for Phaser text
  game.scene.start('default');
});

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.hydrogenC = 0;
    this.heliumC = 0;
  }

  preload() {
    this.load.image("bg", "/images/bg.png");
    this.load.image("spaceship", "/images/spaceship.png");
    this.load.image("obstacle1", "/images/obstacle1.png");
    this.load.image("obstacle2", "/images/obstacle2.png");
    this.load.image("obstacle3", "/images/obstacle3.png");
    this.load.image("helium", "/images/helium.png");
    this.load.image("hydrogen", "/images/hydrogen.png");
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add.image(100, sizes.height / 2, "spaceship").setOrigin(0, 0).setScale(0.3);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setDrag(0, drag);
    this.player.body.setGravity(0, 0);
    this.player.setCollideWorldBounds(true);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.obstacles = this.physics.add.group();
    this.time.addEvent({
      delay: 2000, 
      callback: this.spawnO,
      callbackScope: this,
      loop: true,
    });

    this.hydrogen = this.physics.add.group();
    this.helium = this.physics.add.group();
    this.time.addEvent({
      delay: 3000, 
      callback: this.spawnEHH,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(this.player, this.hydrogen, this.cHydrogen, null, this);
    this.physics.add.overlap(this.player, this.helium, this.cHelium, null, this);
    this.physics.add.collider(this.player, this.obstacles, this.Obstacle, null, this);
  }

  update() {
    const { up, down } = this.cursor;

    if (up.isDown) {
      this.player.setAccelerationY(-acc);
    }
    else if (down.isDown) {
      this.player.setAccelerationY(acc);
    }
    else {
      this.player.setAccelerationY(0);
    }

    if (this.hydrogenC >= 3 && this.heliumC >= 3) {
      this.scene.start("WinScene");
    }

    
  }

  spawnO() {
    const posY = Phaser.Math.Between(100, sizes.height - 100);

    const obstacles = ["obstacle1", "obstacle2", "obstacle3"];
    const random = Phaser.Math.RND.pick(obstacles);

    const obstacle = this.obstacles.create(sizes.width, posY, random).setOrigin(0, 0).setScale(0.7);
    obstacle.setVelocityX(-200); 
    obstacle.body.allowGravity = false;
    obstacle.setImmovable(true);
  }

  spawnEHH() {
    const elementsY = Phaser.Math.Between(50, sizes.height - 100);

    
    const elements = [this.hydrogen, this.helium];
    const random = Phaser.Math.RND.pick(elements);
    const element = random.create(sizes.width, elementsY, random === this.hydrogen ? 'hydrogen' : 'helium').setOrigin(0, 0).setScale(0.3);
    element.setVelocityX(-200); 
    element.body.allowGravity = false;
    element.setImmovable(true);
  }

  cHelium(player, helium) {
    helium.destroy(); 
    this.heliumC++; 
  }

  cHydrogen(player, hydrogen) {
    hydrogen.destroy(); 
    this.hydrogenC++;
  }

  Obstacle() {
    //this.scene.restart();
    this.scene.start('LoseScene');
    this.hydrogenC = 0;
    this.heliumC = 0; 
  }
}

class WinScene extends Phaser.Scene {
  constructor() {
      super({ key: 'WinScene' });
      this.dialogueBox = null;
      this.dialogueText = null;
      this.currentDialogueIndex = 0;
      this.dialogue = [
        "L1527 harbors a protostar in the neck of its hourglass-shaped structure, which is located approximately 460 light-years from Earth.", 
        "Thanks to the technology of the James Webb Space Telescope, the clouds are now an ideal target for NIRCam, its near-infrared camera.",
         "The photo from the James Webb Space Telescope has revealed details of protostar births, showing a protoplanetary disk and a small sphere of hot gas with between 20% and 40% of the mass of the Sun."
      ];
      this.typingInterval = 20; // Time in milliseconds between characters
      this.isTyping = false; // To check if dialogue is currently being typed
  }

  preload(){
    this.load.image('star', '/images/star.jpg');

  }

  create() {
    this.add.image(0, 0, 'star').setOrigin(0, 0).setDisplaySize(sizes.width, sizes.height);
    this.dialogueBox = this.add.graphics();
        this.dialogueBox.fillStyle(0x000000, 0.5); // Semi-transparent black
        this.dialogueBox.fillRect(20, this.cameras.main.height - 150, this.cameras.main.width - 100, 100); // Position and size
  
        // Create text object for the dialogue
        this.dialogueText = this.add.text(60, this.cameras.main.height - 140, '', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Orbitron',
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


    const levelText = this.add.text(750, 250, 'Level 2', {
      fontSize: '32px',
      color: '#FEC260',
      fontFamily: 'Orbitron',
      fontWeight: 500
    });
    levelText.setOrigin(0.5); 

  const instructionsText = this.add.text(525, 300, "Drive your spaceship avoiding the asteroids and collecting three particles of hydrogen of each color.", {
    fontSize: '26px',
    color: '#ffffff',
    fontFamily: 'Exo',
    wordWrap: { width: 485, useAdvancedWrap: true }, 
    align: 'center', 
  })

    const startB = this.add.text(750, 450, 'Empezar', {
      fontSize: '30px',
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
        this.scene.start('scene-game'); 
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

    const gameOverText = this.add.text(750, 250, "¡Chocaste!", {
      fontSize: '32px',
      fontFamily: 'Orbitron',
      color: '#FEC260'
    });
    gameOverText.setOrigin(0.5); 

    const restartB = this.add.text(750, 350, 'Reintentar', {
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

class WinScene2 extends Phaser.Scene {
  constructor() {
      super({ key: 'WinScene2' });
      
      // Textbox elements (hidden by default)
      this.textbox = null;
      this.titleText = null;
      this.bodyText = null;
  }

  preload() {
      this.load.image('star', '/images/star.jpg');
  }

  create() {
    this.add.image(0, 0, 'star').setOrigin(0, 0).setDisplaySize(sizes.width, sizes.height);
    this.dialogueBox = this.add.graphics();
    this.instructions = this.add.text(400, 250, 'Click on the dots to learn more!', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setVisible(false);

    // Create circles that open textboxes
    this.createCircle(758, 360, 'L1527 Star', 'This class corresponds to the earliest stage of star formation, and they are surrounded by dark clouds of dust and gas', 0xfcba03);
    this.createCircle(746, 280, 'Nebulous 1', 'The layers of dust between the Webb telescope and the clouds filter the light, where the denser dust blocks blue light, creating orange bubbles..', 0xfcba03);
    this.createCircle(774, 440, 'Nebulous 2', 'As matter falls into the center of the protostar, it spirals around the core.', 0xfcba03);

    // Create the textbox (hidden by default)
    this.createTextbox();

    const winB = this.add.text(sizes.width - 100, sizes.height - 100, 'Finish', {
        fontSize: '26px',
        fontFamily: 'Orbitron',
        color: 'white',
        backgroundColor: '#A12568',
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setInteractive();
    winB.setOrigin(0.5);
    
    // hover effect
    winB.on('pointerover', () => {
        winB.setStyle({ backgroundColor: '#FEC260' });
    });
    
    winB.on('pointerout', () => {
        winB.setStyle({ backgroundColor: '#A12568 ' });
    });
    
    // fade-out and redirect
    winB.on('pointerdown', () => {
      window.location.href = 'http://localhost:3000';
    });

    // Add global input listener to close the textbox when clicking outside of it
    this.input.on('pointerdown', (pointer) => {
        if (this.textbox.visible) {
            // Check if the click is outside the textbox
            if (!this.textbox.getBounds().contains(pointer.x, pointer.y)) {
                this.closeTextbox();
            }
        }
    });
}

createCircle(x, y, title, paragraph, color) {
    const circle = this.add.circle(x, y, 10, color).setInteractive();

    // Add click event to the circle
    circle.on('pointerdown', () => {
        this.openTextbox(title, paragraph, x, y);  // Pass circle's position to openTextbox
    });
}

createTextbox() {
    this.textbox = this.add.rectangle(0, 0, 400, 200, 0xA12568, 0.7).setOrigin(0.5).setVisible(false);
    this.titleText = this.add.text(0, 0, '', { fontSize: '17px', color: '#000000', fontFamily: 'Orbitron'}).setOrigin(0.5).setVisible(false);
    this.bodyText = this.add.text(0, 0, '', { fontSize: '15px', color: '#00000', wordWrap: { width: 380 }, fontFamily: 'Orbitron' }).setOrigin(0.5).setVisible(false);

    // Close button (optional)

}

openTextbox(title, paragraph, x, y) {
    // Adjust the position of the textbox next to the circle
    const textboxX = x + 100;  // You can adjust the offset as needed
    const textboxY = y;

    // Set textbox position and make it visible
    this.textbox.setPosition(textboxX, textboxY).setVisible(true);
    this.titleText.setPosition(textboxX, textboxY - 45).setText(title).setVisible(true);
    this.bodyText.setPosition(textboxX, textboxY).setText(paragraph).setVisible(true);
    this.closeButton.setPosition(textboxX + 180, textboxY - 80).setVisible(true);  // Adjust close button position
}

closeTextbox() {
    this.textbox.setVisible(false);
    this.titleText.setVisible(false);
    this.bodyText.setVisible(false);
    this.closeButton.setVisible(false);
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
      debug: true,
    },
  },
  scene: [  StartScene, GameScene,  LoseScene, WinScene, WinScene2 ], 
};

const game = new Phaser.Game(config);
