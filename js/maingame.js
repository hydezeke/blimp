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
    
	//foldStart
	
   var game = new Phaser.Game(800, 450, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

    function preload() {
		
		
		game.load.audio('hit1','assets/hit1.wav');
		game.load.audio('hit2','assets/hit2.wav');
		game.load.audio('shoot1','assets/shoot1.wav');
		
		
        game.load.spritesheet('sorc', 'assets/sorc.png', 64,64);
        game.load.spritesheet('bat', 'assets/bat.png', 32,32);
		game.load.spritesheet('bullet', 'assets/blast.png', 16,16);
       // game.load.image('background', 'assets/background2.png');
        //Phaser.Canvas.setSmoothingEnabled(game.context, false)
        
        game.load.tilemap('worldMap', 'assets/newWorld.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('worldTiles', 'assets/world.png');
        game.load.image('rotating', 'assets/boss_roots.png');
        //==begin load new images
        game.load.image('bossHandLeft', 'assets/bossHandLeft.png');
        game.load.image('bossHandRight', 'assets/bossHandRight.png');
        game.load.image('bossMain', 'assets/bossMain.png');
		game.load.image('title','assets/title.png');
//==end load new images
		game.load.audio('music','assets/Foreboding_by_JadeLune.ogg');
		game.load.image('perish','assets/perish.png');
		game.load.image('vanquish','assets/vanquish.png');
		game.load.audio('yay','assets/yay.wav');
   
   }
    
    var rotating = true;

    var player;
	var title;
	var titleShowing = true;
	
	
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
    
    var health = 100;
    
    var fireRate = 10;
    var nextFire = 0;
    this.fireRate = 20;
    var ammo = 10;
    var equip = true;
	
	var bossTimer = 180;
	var upKey,leftKey,rightKey,downKey;
	
	var batSpawners;
	
	var restartTimer = -1;
	
	var bossSpawned = false;
    var bossHealth = 10;
	//foldClose
    var handleft;
	var handright;
	
	var regMusic;
	
	
    function bossCreate(){
		bossHealth = 10000;
        rotating2 = game.add.sprite(1000, 1000, 'rotating');
        rotating2.anchor.setTo(0.5, 0.5);
        rotating2.scale.setTo(1, 1);
        boss = game.add.sprite(100, 100, 'bossMain');
        boss.anchor.setTo(0.5, 0.5);
        boss.scale.setTo(1, 1);
        game.physics.arcade.enable(boss);
        boss.body.allowGravity = false;
        boss.body.collideWorldBounds = true;

        handleft = game.add.sprite(boss.x-100, boss.y+50, 'bossHandLeft');
        handleft.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(handleft);
        handleft.body.collideWorldBounds = true;
        handleft.body.allowGravity = false;
        
        handright = game.add.sprite(boss.x+100, boss.y+50, 'bossHandRight');
        handright.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(handright);
        handright.body.collideworldbounds = true;
        handright.body.allowGravity = false;
        
//==//
    }

    function create() {
		bossSpawned = false;
		restartTimer = -1;
		bossTimer = 4500;
		health = 10000;
        bossKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        
        this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();
        
        game.stage.backgroundColor = '#9890b7';

        //  The 'mario' key here is the Loader key given in game.load.tilemap
        map = game.add.tilemap('worldMap');

        //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //  The second parameter maps this name to the Phaser.Cache key 'tiles'
        map.addTilesetImage('world', 'worldTiles');
        
        
        map.createLayer('bg');
        map.createLayer('bg2');
		//bossCreate();
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
        player.y = 1820

        player.body.bounce.y = 0;
        player.body.collideWorldBounds = true;
        player.body.setSize(20, 42, 0, 0);
        
        player.anchor.setTo(.5,1);

        player.animations.add('left', [0, 1, 2, 3,4,5,6,7], 10, true);
        player.animations.add('idle', [8,9,10,11,12], 10, true);
        player.animations.add('right', [0, 1, 2, 3,4,5,6,7], 10, true);
        player.animations.add('fall', [17,18,19,20],20,true);
        
		title = game.add.sprite(player.x-32,player.y-32,'title');
		titleShowing = true;
		//tite.anchor.setTo(.5,1);
		
		title.x = player.x-192;
		title.y = player.y-256;

		game.camera.follow(player);
        
        
        

        cursors = game.input.keyboard.createCursorKeys();
		
		upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
		downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
		
		//cursors.up.keycode = Phaser.KeyCode.W;
		//cursors.left.keycode = Phaser.KeyCode.A;
		//cursors.right.keycode = Phaser.KeyCode.D;
		//cursors.down.keycode = Phaser.KeyCode.S;
		
		
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        player.animations.play('idle');
        
        game.physics.enable(player);
        
        game.add.existing(layer);
        
        map.setCollisionBetween(0,48);
        
        bats = game.add.group();
        bats.enableBody = true;
		
		
        
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
		
		
		batSpawners = game.add.group();
        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        map.createFromObjects('obj',39, null, 0, true, false, batSpawners);
       // bats.create(player.position.x+32,player.position.y,'bat');
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
	
	var batSpawnTimer = 0.5;
	function batSpawnUpdate(){
		if(titleShowing){
			return;
		}
		batSpawnTimer -= game.time.elapsed/1000;
		while(batSpawnTimer < 0){
			batSpawnTimer += 5;
			var dist = 100000000;
			var temp = 0;
			//game.sound.play('hit2');
			//return;
			
			batSpawners.forEach(function(item) {
			//game.physics.arcade.collide(item, bullets, killBat, item, this);
				//spawnBat(item.body.position.x, item.body.position.y);
				//game.sound.play('hit2');
				var myPoint = new Phaser.Point();
				myPoint.x = player.x - item.x;
				myPoint.y = player.y - item.y;
				temp = myPoint.getMagnitude();
				if(temp < dist && temp > 100){5
					spawnBat(item.x, item.y);
				}
				
			}, this);
		}
	}
	
	function spawnBat(x, y){
		//game.sound.play('hit2',0.5);
		var b = bats.create(x,y,'bat');
		b.animations.add('fly',[0,1],5,true);
		b.animations.add('die','die', [2,3,4,5,6], 5, false);
		b.animations.play('fly',true);
        bats.forEach(function(item) {
            item.body.allowGravity = false;
            item.body.collideWorldBounds = true;
        }, this);
	}
    
	var prevTitleShowing = true;
    var bossKey;
    function update(){
		if(restartTimer > 0){
			if(vanquish != null && vanquish.exists){
				vanquish.x = player.x;
				vanquish.y = player.y;
			}
			restartTimer -= game.time.elapsed/1000;
			if(restartTimer <= 0){
				health = 100;
				bossTimer = 180;
				game.state.start(game.state.current);
			}
			return;
		}
		
		if(prevTitleShowing && !titleShowing){
			prevTitleShowing = false;
			title.kill();
			game.sound.play('music',0.5,true);
		}
		
		if(!titleShowing)
			bossTimer -= game.time.elapsed/10;
        
        
        if(bossKey.isDown){
            bossTimer = 0;
        }
		if(bossTimer < 0){
			bossTimer = 0;
			if(!bossSpawned){
				bossSpawned = true;
				bossCreate();
			}
		}
		var bbt = Math.round((bossTimer/180)*140+43);
		var gbt = Math.round((bossTimer/180)*100+44);
		var rbt = Math.round((1-bossTimer/180)*70 + 152);
		//game.stage.backgroundColor = (rbt)*256*256+gbt*256+bbt;
		batSpawnUpdate();
        game.physics.arcade.collide(player, layer);
        //game.physics.arcade.collide(player, bats);
        game.physics.arcade.collide(bats, layer);
        game.physics.arcade.collide(bats,bats);
        playerUpdate();
        batUpdate();
        shootUpdate();
        var f = Math.round((health/100)*255);
        player.tint = f*256*256+f*256+f;
        health += 10*game.time.elapsed/1000;
        if(health > 100)
            health = 100;
		
       
        
		
        
		if(true || bossSpawned){
			//game.physics.arcade.collide(boss, player);
           // game.stage.backgroundColor = 0xFF3333;
			game.physics.arcade.collide(boss, layer);
			handsMove();
			rotateUpdate();
			bossUpdate();
			 // handsMove();
		}
			
		
        
		
		//==new function calls
      
//==end new function calls
    }
    
    function distance (x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);

    }
    var shootTimer = 0;
   var shootTimer = 0;
    function shootUpdate(){
        shootTimer -= game.time.elapsed;
         if ( shootTimer < 0 && game.input.activePointer.isDown) //On mouse click
         {  
            shootTimer = 200;
            var d = 100000;
            var current = null;
            fire();
            
            if(current == null){
                 return;
            }
            
         }
        return;
    }
    
    function fire() {

        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            if(ammo > 0 && equip){
				game.sound.play('shoot1',0.5);
                nextFire = game.time.now + 2;
                var bullet = bullets.getFirstDead();
                bullet.body.allowGravity = false;
                bullet.body.collideWorldBounds = false;
                bullet.scaleSpeed = 20;
                bullet.tracking = true;
                bullet.reset(player.x - 10, player.y - 20);
                game.physics.arcade.moveToPointer(bullet, 3000);

            }
        }

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
        game.physics.arcade.overlap(player,bats, batHurtPlayer,null, this);
        var len;
        bats.forEach(function(item) {
        //game.physics.arcade.collide(item, bullets, killBat, item, this);
            var myPoint = new Phaser.Point();
            myPoint.x = player.body.position.x - item.body.position.x;
            myPoint.y = player.body.position.y - item.body.position.y;
            myPoint.normalize();
            
            item.body.acceleration.x = myPoint.x*2000;
            item.body.acceleration.y = myPoint.y*2000;
            item.body.velocity.x = checkV(item.body.velocity.x,400);
            item.body.velocity.y = checkV(item.body.velocity.y,400);
            item.body.maxVelocity = 0.1;
           /* if (game.physics.arcade.collide(item, player, collisionHandler, processHandler, this))
            {
                item.animations.play('die');
            }*/
        }, this);
    }
    function killBat(a,b){
		
		a.kill();
        b.kill();
    }
    function playerUpdate() {

        // game.physics.arcade.collide(player, layer);
       // player.tint = Math*random()*0xffffff;
        
        
        if(player.body.onFloor()){
            if(!onFloor){
                yScale = 0.2;
            }
        }
        else if(onFloor){
            yScale = 1.2;
        }
        
        onFloor = player.body.onFloor();
        
        if (cursors.left.isDown || leftKey.isDown)
        {
			titleShowing = false;
            player.body.velocity.x += -horSpeed*game.time.elapsed/30;
            facing = 'left';
            idle = false;
        }
        else if (cursors.right.isDown || rightKey.isDown)
        {
			titleShowing = false;
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
        

        
        if (jumpButton.isDown || upKey.isDown)// && /*player.body.onFloor() &&*/ game.time.now > jumpTimer)
        {
            if(onFloor){
				titleShowing = false;
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
    
    function batHurtPlayer(a,b){
		var myPoint = new Phaser.Point(player.x-b.x,player.y-b.y);
		player.body.velocity.x += myPoint.normalize().x*1000;
		//player.body.velocity.y += myPoint.normalize().y*1000;
		if(player.onFloor && player.body.velocity.y > 0){
			player.body.velocity.y = 0;
		}
		b.kill();
        hurtPlayer(10);
		game.sound.play('hit1');
    }
    function hurtPlayer(h){
        health-= h;
		if(health <= 0){
			game.add.sprite(player.x,player.y,'perish');
			player.kill();
			restartTimer = 3;
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
    //== begin new functions
    //rotates background
    function rotateUpdate(){
        rotating2.angle += -1;
        rotating2.x = boss.x;
        rotating2.y = boss.y;
    }
    
    function bossUpdate(){
		//game.sound.play('hit1');
        var ydist = Math.abs(boss.y-player.y);
        var xdist = Math.abs(boss.x-player.x);
        accelerationXY();
        //stop boss from getting too close
        if (ydist < 200){ 
            boss.body.velocity.y = 0; 
        }
        if (xdist < 200){ 
            boss.body.velocity.x = 0; 
        }

        deLodge();
		bossHurtTimer -= game.time.elapsed/1000;
		var p = new Phaser.Point(xdist,ydist);
		if(p.getMagnitude() < 150 && bossHurtTimer <= 0){
			game.sound.play('hit2');
			hurtPlayer(30);
			//boss.body.velocity += (new Phaser.Point(boss.x-player.x,boss.y-player.y)).normalize()*100;
			//player.body.velocity.x += player.x-boss.x*50;
			bossHurtTimer = 1;
		}
		
		var fa = 0;
		if(bossGotHitTimer < 0){
			fa = 1;
		}
		bossGotHitTimer -= game.time.elapsed;
		
		if(handright != null && handright.exists){
			handright.alpha = fa;
		}
		if(handleft != null && handleft.exists){
			handleft.alpha = fa;
		}
		if(rotating2 != null && rotating2.exists){
			rotating2.alpha = fa;
		}
		if(boss != null && boss.exists){
			boss.alpha = fa;
		}
		
		game.physics.arcade.collide(handright, handleft);
        game.physics.arcade.collide(handright, player);
        game.physics.arcade.collide(handleft, player);
        
        game.physics.arcade.overlap(bullets, boss, bossHit, null, this);
        game.physics.arcade.overlap(bullets, handleft, bossHit,null, this);
        game.physics.arcade.overlap(bullets, handright, bossHit, null, this);
		
    }
	var bossHurtTimer = 0;
	
	var bossGotHitTimer = 0;
    var vanquish;
	function bossHit(a, b){
		bossGotHitTimer = 0.2;
        bossHealth = bossHealth -200;
        if (bossHealth <= 70 && handleft.exists){ handleft.kill(); game.sound.play('hit2'); }
        if (bossHealth <= 40 && handright.exists){ handright.kill(); game.sound.play('hit2');}
        if (bossHealth <= 20 && rotating2.exists){ rotating2.kill(); game.sound.play('hit2');}
        if (bossHealth <= 0 && boss.exists){ 
		
			vanquish = game.add.sprite(boss.x,boss.y,'vanquish');
			//player.addChild(s);
			restartTimer = 3;
			boss.kill(); 
			game.sound.play('yay');
		}
        b.kill();
		
    }
	
    //make boss follow player
    function accelerationXY(){
        var yvar = boss.y-player.y;
        var xvar = boss.x-player.x;
        if (yvar<0){ 
            boss.body.velocity.y += 2; 
        } else { 
            boss.body.velocity.y += -2; 
        }        
        if (xvar<0){ 
            boss.body.velocity.x += 2; 
        } else { 
            boss.body.velocity.x += -2; 
        }
    }
    //stops boss from getting stuck colliding
    function deLodge(){
        if (boss.body.touching.right){
            boss.body.velocity.x = -10;
        }
        if (boss.body.touching.left){
            boss.body.velocity.x = 10;
        }
        if (boss.body.touching.down){
            boss.body.velocity.y = -10;
        }
        if (boss.body.touching.up){
            boss.body.velocity.y = 10;
        }
    }
    
//==begin new functions
   function handsMove(){
        game.physics.arcade.accelerateToObject(handleft, player, 100, 500, 500);
        game.physics.arcade.accelerateToObject(handright, player, 100, 500, 500);
    }
//==end new functions
//==// end new function groups
};
