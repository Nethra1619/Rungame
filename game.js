const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;
let obstacles;
let score = 0;
let scoreText;

function preload() {
    this.load.image('ground', 'assets/images.png'); // Use your ground image
    this.load.image('player', 'assets/images - 2024-11-27T190526.273.jpeg'); // Use your player image
    this.load.image('obstacle', 'assets/images - 2024-11-27T190401.597.jpeg'); // Use your obstacle image
}

function create() {
    // Create platforms (ground)
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'ground').setScale(2).refreshBody();

    // Create player
    player = this.physics.add.sprite(100, 450, 'player').setScale(0.5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Add collisions
    this.physics.add.collider(player, platforms);

    // Create obstacles
    obstacles = this.physics.add.group();

    this.time.addEvent({
        delay: 1500,
        loop: true,
        callback: () => {
            const x = 800;
            const y = 520;
            const obstacle = obstacles.create(x, y, 'obstacle');
            obstacle.setVelocityX(-200);
        }
    });

    this.physics.add.collider(obstacles, platforms);

    // Check for collisions with obstacles
    this.physics.add.overlap(player, obstacles, gameOver, null, this);

    // Add score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Add cursor input
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }

    // Increment score
    score++;
    scoreText.setText('Score: ' + score);
}

function gameOver(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    scoreText.setText('Game Over!');
}
