window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800,450, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    var score = 0;
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'ship', 'assets/ship.png' );
        game.load.image( 'laser', 'assets/laser.png');
        game.load.image('ball', 'assets/ball.png');
    }
    
    var bouncy;
    
    var baddies;
    
    var mainTimer;
    var spawnTimer;
    var scoreText;
    function create() {
        mainTimer = 0.000;
        spawnTimer = 2.000;
        // Create a sprite at the center of the screen using the 'logo' image.
        bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'ship' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        bouncy.anchor.setTo( 0.5, 0.5 );
        baddies = game.add.group();
        baddies.enableBody = true;
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "15px Verdana", fill: "#ffffff", align: "center" };
        scoreText = game.add.text( 25, 15, "Build something awesome.", style );
        text.anchor.setTo( 0.5, 0.0 );
        
    }
    
    function update() {
        mainTimer += game.time.elapsed/100;
        spawnTimer -= game.time.elapsed/1000;
        var f = Math.round(mainTimer);
        scoreText.text = "score .. " + f.toString();
        
        
        if(spawnTimer < 0){
            
            spawnTimer = 1;
            var lx = 0;
            var ly = 0;
            Math.random();
            if(Math.random < 0.5){ // LEFT OR RIGHT SIDE
                ly = Math.random*450;
                if(Math.random < 0.5){
                    lx = -150;
                }
                else{
                    lx = 950;
                }
            }
            else{
                lx = Math.random*800;
                if(Math.random < 0.5){
                    ly = -150;
                }
                else{
                    ly = 300;
                }
            }
            var las = baddies.create(lx,ly,'ball');
            las.body.gravity = 0;
            game.physics.arcade.enable(las);
            las.body.velocity.x = game.world.centerX-lx/5;
            las.body.velocity.y = game.world.centerY-ly/5;
        }
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, this.game.input.activePointer, 5000, 300, 300 );
        bouncy.body.position.x = game.input.mousePointer.x;
        bouncy.body.position.y = game.input.mousePointer.y;
    }
};
