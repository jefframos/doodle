const { exec } = require('child_process');

// Command to run TexturePacker with your configuration file
const command = 'TexturePacker --format pixijs4 --sheet spritesheet/pokes.png --data spritesheet/pokes.json output';

exec(command, (error, stdout, stderr) => {
    console.error(`Start Packing, it takes a while`);

  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`TexturePacker Error: ${stderr}`);
    return;
  }
  console.log('Sprite sheet generated successfully.');
});