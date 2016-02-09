//http://phaser.io/examples/v2/arcade-physics/asteroids-movement

var game = new Phaser.Game(800, 450, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'assets/bg.png');
    game.load.image('bullet', 'assets/laser.png');
    game.load.image('ship', 'assets/ship.png');

    game.load.image('block','assets/block.png');
    game.load.image('shiplit','assets/shiplit.png');
    game.load.image('blocklit','assets/blocklit.png');
    
    game.load.audio('spawnSound','assets/spawn.wav');
    game.load.audio('expl','assets/expl.wav');
}

var sprite;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;

var baddies;

var mainScore = 0;
var scoreText;

var restartTimer = -2;

var restartText;

function create() {

    //  This will run in Canvas mode, so let's gain a little speed and display
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    //  We need arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A spacey background
    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    //  Our ships bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    //  All 40 of them
    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    //  Our player ship
    sprite = game.add.sprite(400,225, 'ship');
    sprite.anchor.set(0.5);
    var childLit = sprite.addChild(game.make.sprite(0,0, 'shiplit'));
    childLit.anchor.set(0.5,0.5);

    //  and its physics settings
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    sprite.body.drag.set(250);
    sprite.body.maxVelocity.set(250);

    //  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    baddies = game.add.group();
    baddies.enableBody = true;
    game.physics.enable( baddies, Phaser.Physics.ARCADE );
    
    var style = { font: "15px Verdana", fill: "#ffffff", align: "center" };
    scoreText = game.add.text( 25, 15, ".", style );
    
    var rstyle = { font: "25px Verdana", fill: "#ffffff", align: "center" };
    restartText = game.add.text(25,33," ",style);
}

function restart(){
    restartTimer = -2;
    mainScore = 0;
    
   // sprite.reset(game.world.center.x, game.world.center.y);
    //sprite.anchor.set(0.5);
    //var childLit = sprite.addChild(game.make.sprite(0,0, 'shiplit'));
    //childLit.anchor.set(0.5,0.5);

    //  and its physics settings
   // game.physics.enable(sprite, Phaser.Physics.ARCADE);

    //sprite.body.drag.set(250);
    //sprite.body.maxVelocity.set(250);
    
    baddies.destroy(true,true);
    
}

function update() {
    
    if(restartTimer > 0){
        restartTimer += game.time.elapsed/1000;
        var f = Math.round(mainScore);
        var rt = Math.ceil(restartTimer);
        restartText.text = "Refresh page to restart.";
        
        if(restartTimer <= 0)
            restart();
        return;
    }
    
    mainScore += game.time.elapsed/500;
    var f = Math.round(mainScore);
    scoreText.text = ""+f.toString();
    
    //game.physics.arcade.collide(sprite, baddies);
    
    game.physics.arcade.overlap(sprite, baddies, explode);
   // game.physics.arcade.collide(baddies, baddies);

    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(sprite.rotation, 400, sprite.body.acceleration);
    }
    else
    {
        sprite.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        sprite.body.angularVelocity = -400;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularVelocity = 400;
    }
    else
    {
        sprite.body.angularVelocity = 0;
    }

   /* if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }*/

    screenWrap(sprite);

    bullets.forEachExists(screenWrap, this);
    
    baddyUpdate();
}
var timer = 2;
function baddyUpdate(){
    timer -= game.time.elapsed/1000;
    if(timer < 0){
        timer += 4;
         if(game.rnd.integerInRange(0,2) == 0){ // LEFT OR RIGHT SIDE
                ly = game.rnd.integerInRange(0,450);
                if(game.rnd.integerInRange(0,2) == 0){
                    lx = -150;
                }
                else{
                    lx = 950;
                }
            }
            else{
                lx = game.rnd.integerInRange(0,800);
                if(game.rnd.integerInRange(0,2) == 0){
                    ly = -150;
                }
                else{
                    ly = 600;
                }
            }
            var las = baddies.create(lx,ly,'block');
           // game.physics.enable( las, Phaser.Physics.ARCADE );
            las.name = "bad"+las;
           //las.body.gravity.y = Math.random*100-50;
           // las.body.gravity.x = Math.random*100-50;
            //las.body.velocity.setTo(200, 200);
            las.body.bounce.setTo(1,1);
            las.body.collideWorldBounds = true;
            las.body.velocity.setTo(game.rnd.integerInRange(-100, 100), game.rnd.integerInRange(-100, 100));
            //las.body.velocity.x = Math.random*500;//game.world.centerX-lx/5;
            //las.body.velocity.y = Math.random*500;//game.world.centerY-ly/5;
            //las.angularVelocity = Math.random*1000-500;
            las.anchor.set(0.5,0.5);
            var childLit = las.addChild(game.make.sprite(0,0, 'blocklit'));
            childLit.anchor.set(0.5,0.5);
            var sca = 0.5;
            if(mainScore > 30){
                
                sca = 0.5*Math.round(mainScore/30)+0.5;
            }
            las.scale.setTo(sca,sca);
            game.sound.play('spawnSound');
    }
    
}
function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = sprite.rotation;
            game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
        }
    }

}

function screenWrap (sprite) {

    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }

}

function explode(){
    game.sound.play('expl');
    sprite.kill();
    restartTimer = 3;
}

function render() {
}