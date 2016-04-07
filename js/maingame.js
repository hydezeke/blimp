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
    
   var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.spritesheet('sorc', 'assets/sorc.png', 64, 64);
        game.load.spritesheet('bat', 'assets/bat.png', 32,32);
        game.load.spritesheet('blast', 'assets/blast.png', 16,16);
        game.load.image('background', 'assets/background2.png');
        //Phaser.Canvas.setSmoothingEnabled(game.context, false)
        
        game.load.tilemap('worldMap', 'assets/newWorld.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('worldTiles', 'assets/world.png');
    }

    var player;
    var facing = 'left';
    var jumpTimer = 0;
    var cursors;
    var jumpButton;
    var bg;
    var idle = true;
    
    var horSpeed = 400;
    var jumpSpeed = 600;
    var grav = 1200;
    
    var yScale = 1;
    var scaleCorrect = 8;
    
    var map;
    var layer;

    function create() {
        
        game.stage.backgroundColor = '#88aa77';

        //  The 'mario' key here is the Loader key given in game.load.tilemap
        map = game.add.tilemap('worldMap');

        //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //  The second parameter maps this name to the Phaser.Cache key 'tiles'
        map.addTilesetImage('world', 'worldTiles');
        
        
        map.createLayer('bg');
        map.createLayer('bg2');
        layer = map.createLayer('World1');
        

        //  This resizes the game world to match the layer dimensions
        layer.resizeWorld();
        
        //game.world.setBounds(0, 0, 960, 960);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //game.time.desiredFps = 30;

       // bg = game.add.tileSprite(0, 0, 800, 600, 'background');

        game.physics.arcade.gravity.y = grav;

        player = game.add.sprite(32, 32, 'sorc');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        
        player.x = game.width/2;
        player.y = game.height/2;

        player.body.bounce.y = 0;
        player.body.collideWorldBounds = true;
        player.body.setSize(20, 42, 0, 0);
        
        player.anchor.setTo(.5,1);

        player.animations.add('left', [0, 1, 2, 3,4,5,6,7], 10, true);
        player.animations.add('idle', [8,9,10,11,12], 10, true);
        player.animations.add('right', [0, 1, 2, 3,4,5,6,7], 10, true);
        player.animations.add('fall', [13,14,15,16],20,true);
        
        game.camera.follow(player);

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        player.animations.play('idle');
        
        game.physics.enable(player);
        
        game.add.existing(layer);
        
         map.setCollisionBetween(0,48);
        
        bats = game.add.group();
        bats.enableBody = true;
        
        bullets = game.add.group();
        bullets.enableBody = true;

        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        map.createFromObjects('obj',39, 'bat', 0, true, false, bats);
        
        bats.create(player.position.x+32,player.position.y,'bat');
        //bats.children[bats.children.length-1].body.allowGravity = false;

        //  Add animations to all of the coin sprites
        bats.callAll('animations.add', 'animations', 'fly', [0, 1], 5, true);
        bats.callAll('animations.add', 'animations', 'die', [2,3,4,5,6], 5, false);
        bats.callAll('animations.play', 'animations', 'fly');
        bats.forEach(function(item) {
            item.body.allowGravity = false;
            item.body.collideWorldBounds = true;
        }, this);
    }
    var onFloor = true;
    
    function update(){
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(player, bats);
        game.physics.arcade.collide(bats, layer);
        playerUpdate();
        batUpdate();
        
        shootUpdate();
    }
    
    function distance (x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);

    }
    var shootTimer = 0;
    function shootUpdate(){
        shootTimer -= game.time.elapsed;
         if (shootTimer < 0 && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
             shootTimer = 500;
             var d = 100000;
             var current = null;
             bats.forEach(function(item) {
                var dd = distance(player.body.position.x,player.body.position.y,item.body.position.x, item.body.position.y);
                 if(dd < d){
                     d = dd;
                     current = item;
                 }
             }, this);
             
             if(current == null){
                 return;
             }
             
             
             var blast = bullets.create(player.position.x,player.position.y-32,'blast');
             blast.animations.add('reg',[0,1],10,true);
             blast.animations.play('reg');
             
             var myPoint = new Phaser.Point();
             myPoint.x = current.body.position.x - player.body.position.x;
             myPoint.y = current.body.position.y - player.body.position.y;
             myPoint.normalize();
             blast.body.allowGravity = false;
             blast.body.velocity.x = myPoint.x*300;
             blast.body.velocity.y = myPoint.y*300;
        }
        return;
    }
    
    //Checks if number is above given number or below negative of that number,
    //Corrects number to be within bound
    
    function checkV(v, max){
        if(v > max){
            return max;
        }
        else if(v < -max){
            return -max;
        }
        return v;
    }
    
    function batUpdate(){
       
        game.physics.arcade.overlap(bullets, bats, killBat, null, this);
        var len;
        bats.forEach(function(item) {
        //game.physics.arcade.collide(item, bullets, killBat, item, this);
           item.body.velocity.x += (Math.random()*2-1)*500*game.time.elapsed/1000;
           item.body.velocity.y += (Math.random()*2-1)*500*game.time.elapsed/1000;
            item.body.velocity.x = checkV(item.body.velocity.x,400);
            item.body.velocity.y = checkV(item.body.velocity.y,400);
            if(item.animations.currentAnim.frame >= 6){
                item.kill();
            }
           /* if (game.physics.arcade.collide(item, player, collisionHandler, processHandler, this))
            {
                item.animations.play('die');
            }*/
        }, this);
    }
    function killBat(a,b){
       a.kill();
        b.animations.play('die');
    }
    function playerUpdate() {

        // game.physics.arcade.collide(player, layer);

       
        if(player.body.onFloor()){
            if(!onFloor){
                yScale = 0.2;
            }
        }
        else if(onFloor){
            yScale = 1.2;
        }
        
        onFloor = player.body.onFloor();
        
        if (cursors.left.isDown)
        {
            player.body.velocity.x += -horSpeed*game.time.elapsed/30;
            facing = 'left';
            idle = false;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x += horSpeed*game.time.elapsed/30;
            facing = 'right';
            idle = false;
        }
        else{
            if(player.body.velocity.x > 0){
                player.body.velocity.x -= game.time.elapsed*5;
                if(player.body.velocity.x < 0){
                    player.body.velocity.x = 0;
                }
            }
            if(player.body.velocity.x < 0){
                player.body.velocity.x += game.time.elapsed*5;
                if(player.body.velocity.x > 0){
                    player.body.velocity.x = 0;
                }
            }
        }
        
        if(facing == 'left'){
            player.scale.x = -1;
        }
        else{
            player.scale.x = 1;
        }
        
        if(onFloor && player.body.velocity.x != 0){
            player.animations.play('left');
        }
        else if(onFloor){
            player.animations.play('idle');
            idle = true;
        }
        else{
            player.animations.play('fall');
            idle = false;
        }
        

        
        if (jumpButton.isDown)// && /*player.body.onFloor() &&*/ game.time.now > jumpTimer)
        {
            if(onFloor){
                player.body.velocity.y = -150;
            }
            player.body.velocity.y -= 2*game.time.elapsed;
            jumpTimer = game.time.now + 150;
        }
        
        yScale = lerpFloat(yScale,1,game.time.elapsed*scaleCorrect/1000);
        player.scale.y = yScale;
        
        
        if(player.body.velocity.y > 700){
            player.body.velocity.y = 700;
        }
        if(player.body.velocity.y < -700){
            player.body.velocity.y = -700;
        }
        
        if(player.body.velocity.x > horSpeed){
            player.body.velocity.x = horSpeed;
        }
        if(player.body.velocity.x < -horSpeed){
            player.body.velocity.x = -horSpeed;
        }
        
    }

    function render () {

        game.debug.text(game.time.suggestedFps, 32, 32);

        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // game.debug.body(player);
        // game.debug.bodyInfo(player, 16, 24);

    }
    
    function lerpFloat(f1, f2, d){
       // return 1;
        if(f1 < f2){
            if(f2-f1 < d){
                return f2;
            }
            return f1 + d;
        }
        else{
            if(f1 - f2 < d){
                return f2;
            }
            return f1-d;
        }
    }
};
