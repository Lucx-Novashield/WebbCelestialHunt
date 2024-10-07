import './style.css'
import Phaser from 'phaser'

const sizes = {
  width: 1500,
  height: 700,
};

class VideoScene extends Phaser.Scene {
  constructor() {
      super({ key: 'VideoScene' });
  }


  preload() {
      // Load the video file
      this.load.video('myVideo', '/video.mp4'); // Replace with your video path
  }

  create() {
    // Add the video to the scene
    const video = this.add.video(sizes.width / 2, sizes.height / 2, 'myVideo'); // Center the video

    // Set the origin to the center of the video
    video.setOrigin(0.5, 0.5);

    // Set the desired scale for the video (adjust these values as needed)
    const scaleX = 1; // Adjust to make it wider
    const scaleY = 1; // Adjust to make it taller
    video.setScale(scaleX, scaleY);

    // Mute the video to ensure autoplay works (optional)
    video.setVolume(100);

    // Play the video
    video.play(true); // The true argument loops the video

    // Listen for video completion
    video.on('complete', () => {
        console.log('Video finished playing');
        window.location.href = 'https://your-url-here.com'; // Replace with your desired URL
    });
}
}

class NextScene extends Phaser.Scene {
  constructor() {
      super({ key: 'NextScene' });
  }

  create() {
      // Example content for the next scene
      this.add.text(100, 100, 'Welcome to the Next Scene!', { fontSize: '32px', fill: '#fff' });
  }
}

// Create the game configuration
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
  scene: [VideoScene, NextScene], // Include both scenes in the game
};

// Initialize the game
const game = new Phaser.Game(config);
