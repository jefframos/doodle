const fs = require('fs');
const sharp = require('sharp');

// Input directory containing individual frame images
const inputDirectory = 'output/';

// Output directory for the sprite sheet image and metadata
const outputDirectory = 'spritesheet/';

// File format for the individual frames (e.g., 'png' or 'jpg')
const frameFormat = 'png';

// Output sprite sheet image format (e.g., 'png' or 'jpg')
const spriteSheetFormat = 'png';

// Width and height of each frame in pixels
const frameWidth = 64;
const frameHeight = 64;

// Number of frames per row in the sprite sheet
const framesPerRow = 1024 * 8 / 64 / 2; // Adjust as needed

// List of frame filenames
const frameFilenames = fs.readdirSync(inputDirectory);

// Create an array to store metadata for each frame
const frames = [];

// Create an empty sprite sheet
let spriteSheet = sharp({
  create: {
    width: frameWidth * framesPerRow,
    height: frameHeight * Math.ceil(frameFilenames.length / framesPerRow),
    channels: 4, // 4 channels for RGBA
    background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
  },
});

frameFilenames.forEach((frameFilename, index) => {
  const frameX = (index % framesPerRow) * frameWidth;
  const frameY = Math.floor(index / framesPerRow) * frameHeight;

  console.log(frameFilename)
  // Process and add each frame to the sprite sheet
  spriteSheet.composite([
    {
      input: `${inputDirectory}/${frameFilename}`,
      left: frameX,
      top: frameY,
    },
  ]);

  // Add frame metadata to the array
  frames.push({
    filename: frameFilename,
    frame: { x: frameX, y: frameY, w: frameWidth, h: frameHeight },
  });
});

// Save the sprite sheet image
spriteSheet.toFile(`${outputDirectory}spritesheet.${spriteSheetFormat}`, (err) => {
  if (err) {
    console.error('Error saving sprite sheet:', err);
  } else {
    console.log('Sprite sheet saved successfully.');

    // Write the metadata file for Pixi.js
    fs.writeFileSync(`${outputDirectory}spritesheet.json`, JSON.stringify({ frames }));
    console.log('Sprite sheet metadata saved successfully.');
  }
});
