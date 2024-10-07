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
    super("WinScene");
  }

  preload() {
    this.load.image('star', '/images/star.jpg'); // Background image
  }

  create() {
    this.add.image(0, 0, 'star').setOrigin(0, 0).setDisplaySize(sizes.width, sizes.height);

    // Function to create an interactive circle
    const createCircle = (x, y, radius, color) => {
      const circle = this.add.graphics();
      circle.fillStyle(color, 1);
      circle.fillCircle(x, y, radius);

      const hitArea = new Phaser.Geom.Circle(x, y, radius);
      circle.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

      return circle;
    };

    // Create two interactive circles
    const circle1 = createCircle(200, 200, 15, 0xFF0000); // Red circle
    const circle2 = createCircle(400, 300, 15, 0x0000FF); // Blue circle

    // Create a hidden textbox (rectangle with text)
    const textbox = this.add.rectangle(750, 400, 400, 200, 0x000000, 0.8).setVisible(false); // Black transparent background
    const titleText = this.add.text(750, 350, '', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Orbitron',
      align: 'center',
    }).setOrigin(0.5).setVisible(false);

    const paragraphText = this.add.text(750, 400, '', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Exo',
      wordWrap: { width: 380, useAdvancedWrap: true },
      align: 'center',
    }).setOrigin(0.5).setVisible(false);

    // Function to show the textbox when a circle is clicked
    const showTextbox = (title, paragraph) => {
      textbox.setVisible(true);
      titleText.setText(title).setVisible(true);
      paragraphText.setText(paragraph).setVisible(true);
    };

    // Add click events for the circles
    circle1.on('pointerdown', () => {
      showTextbox('Circle 1 Title', 'This is the paragraph text for Circle 1.');
    });

    circle2.on('pointerdown', () => {
      showTextbox('Circle 2 Title', 'This is the paragraph text for Circle 2.');
    });

    // Optional: close the textbox when clicking outside
    this.input.on('pointerdown', (pointer, gameObject) => {
      if (gameObject.length === 0) {
        textbox.setVisible(false);
        titleText.setVisible(false);
        paragraphText.setVisible(false);
      }
    });
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


    const levelText = this.add.text(750, 250, 'Nivel 2', {
      fontSize: '32px',
      color: '#FEC260',
      fontFamily: 'Orbitron',
      fontWeight: 500
    });
    levelText.setOrigin(0.5); 

  const instructionsText = this.add.text(525, 300, "Maneja tu nave por el espacio y recolecta 3 átomos de hidrógeno de cada color para ganar. ¡No te choques!", {
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
  scene: [WinScene, StartScene, GameScene, LoseScene], 
};

const game = new Phaser.Game(config);
