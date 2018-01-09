class Canvas                     // CANVAS
{
    constructor()
    {
        this.ctx = document.getElementById('canvas').getContext('2d');
        this.W = canvas.width;
        this.H = canvas.height;
    }
}

class Vector extends Canvas      // VECTOR - template
{
    constructor(width, height)
    {
        super();
        this.x = null;
        this.y = null;
        this.size = { w: width, h: height };
        this.vel = { x: null, y: null };
    }

    get right() {
        return this.x + this.size.w;
    }
    get bottom() {
        return this.y + this.size.h;
    }
    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }
}

class Sprite extends Vector      // SPRITE - template
{
    constructor(path, fwNumber, fhNumber)
    {
        super(32*2, 32*2); // size width/height
        this.img = new Image();
        this.img.src = path;
        this.frame = {
                        w: this.img.width/fwNumber,   // frame width
                        h: this.img.height/fhNumber  // frame height
        };
        this.crop = { x:0, y:0 };      // X & Y pos to crop image
        this.counter = { x:0, y:0 };  // tracks animation interval
        this.key = {left:false, right:false, up:false, down:false, spacebar:false};
    }
    animate(frameSpeed)
    {
        //  creates animation loop  //
        this.columnSpeed = Math.floor(this.counter.x) % this.columnLength;
        this.rowSpeed = Math.floor(this.counter.y) % this.rowLength;//optional
        this.rowSpeed *= this.frame.h;
        this.columnSpeed *= this.frame.w;     // amount to increase each frame
        this.counter.x += frameSpeed || 0.2;  // column animation speed
        this.counter.y += frameSpeed || 0.2;  // row animation speed
        this.draw();
    }

    draw() {  // draws image
        this.ctx.drawImage(this.img,
            this.crop.x, this.crop.y,
            this.frame.w, this.frame.h,
            this.x, this.y,
            this.size.w, this.size.h);
    }

    update(columnX, rowY, columnLength, rowLength) {
        this.columnLength = columnLength;           // update column length
        this.columnX = columnX * this.frame.w;      // update column start position
        this.crop.y = rowY * this.frame.h;          // updates the row position
        this.crop.x = this.columnX+this.columnSpeed // implements the animation

        // if set, creates animation loop for the rows
        this.rowLength = rowLength || null;
        if(this.rowLength !== null) {
            this.rowY = rowY * this.frame.h;
            this.crop.y = this.rowY+this.rowSpeed || null;}
    }

    boundaries() // wall collision
    {
        if (this.x < 0) {
            this.vel.x = 0;
            this.key.left = false
        };
        if (this.right >= this.W) {
            this.vel.x = 0;
            this.key.right = false
        };
        if (this.bottom >= this.H) {
            this.vel.y = 0;
            this.key.down = false
        };
        if (this.y <= 0) {
            this.vel.y = 0;
            this.key.up = false
        };
    }
}

class Thruster extends Sprite    // THRUSTER - graphics
{
    constructor()
    {
        super('img/spaceship_.png', 5, 3.5);
        this.x = this.W/3;
        this.y = this.H/2;

    }
    init(x, y, scaleW, scaleH)
    {
        this.x = x;
        this.y = y;
        this.size.w = scaleW || this.size.w;
        this.size.h = scaleH || this.size.h;
        this.animate();
        this.update(0, 2.46, 2);
    }
}

class ThunderBolt extends Sprite // THUNDERBOLT - graphics
{
    constructor()
    {
        super('img/lightning_.png', 8, 1);

    }
    init(x, y, scaleW, scaleH)
    {
        this.x = x +this.vel.x;
        this.y = y +this.vel.y;
        this.size.w = scaleW || this.size.w;
        this.size.h = scaleH || this.size.h;
        this.animate();

        this.update(0, 0, 8)
    }
}

class Player extends Sprite      // PLAYER
{
    constructor()
    {
        super('img/ellusiveShip_.png', 1, 1);
        this.thruster = new Thruster;       // graphics
        this.turnThruster = new Thruster;   // graphics
        this.thunderBolt = new ThunderBolt; // graphics
        this.thunderBolt2 = new ThunderBolt;// graphics
        this.thunderBolt3 = new ThunderBolt;// graphics
        this.x = this.W/2;
        this.y = this.H-140;
        this.speed = 3 // move speed
        this.stop = true; this.start = false;
        this.direction = {right:false, left:false, up:false, down:false};
    }
    init()
    {
        this.animate();
        this.boundaries();
        this.controller();
    }
    controller()
    {
        this.vel.x = 0;
        this.vel.y = 0;

        // LEFT //
        if(this.key.left &&!(this.key.right || this.key.up || this.key.down))
        {
            this.update(0, 9, 9, 4);
            this.stop = false;
            this.start = true;
            this.direction = {right:false, left:true, up:false, down:false, attack:5};
            this.vel.x = -this.speed;

            // graphics
            this.thunderBolt2.init(this.x+34.55, this.y+58, 5, 10);
            this.thruster.init(this.x-0.5, this.y+this.size.h/1+2, this.thruster.size.w, 35);
            this.turnThruster.init(this.x+22.6, this.y+this.size.h/1.07+2, 30, 25);
        }

        // RIGHT //
        if(this.key.right &&!(this.key.left || this.key.up || this.key.down))
        {
            this.stop = false;
            this.start = true;
            this.direction = {right:true, left:false, up:false, down:false, attack:7};
            this.vel.x = this.speed;

            // graphics
            this.thunderBolt2.init(this.x+23.85, this.y+58, 5, 10);
            this.thruster.init(this.x-0.5, this.y+this.size.h/1+2, this.thruster.size.w, 35);
            this.turnThruster.init(this.x+11.5, this.y+this.size.h/1.07+2, 30, 25);
        }

        // updates animation direction
        if(this.stop)
            this.thruster.init(this.x-0.5, this.y+this.size.h/1+3, this.thruster.size.w, 50);

        // frame to draw at game start
        if(this.start)
            this.update(0, 0, 1);

        this.thunderBolt.init(this.x+23.95, this.y+64, 15, 10); // graphics
        this.thunderBolt3.init(this.x+29, this.y-5, 5, 5);      // graphics
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.stop = true; // stops animation loop
    }


}

class Asteroid extends Sprite    // ASTEROID
{
    constructor()
    {
        super('img/asteroid_3.png', 5, 4);
        this.x = Math.floor(Math.random()*((this.W-70) -0)+0); // random x pos
        this.y = Math.floor(Math.random()*((-200)-(-600))+(-600));//random y pos
    }

    init(scaleW, scaleH)
    {
        this.size.w = scaleW || this.size.w; // updates width if set
        this.size.h = scaleH || this.size.h; // updates height if set
        this.animate();
        this.update(0, 0, 5, 3);
        this.move();
    }

    move() {
        this.y +=1.5;
        if(this.top > this.H) { // resets rock y pos if it reaches bottom
            this.y = Math.floor(Math.random()*((-200) -(-600))+(-600));
        }
    }
}

class Laser extends Sprite       // LASER - template
{
    constructor()
    {
        super('img/laser_.png', 11, 1);
        this.size = {w:20, h:35}
    }

    init(x, y)
    {
        this.x = x;
        this.y = y;
        this.animate(0.3); // frameSpeed set to 0.3
        this.update(0, 0, 11);
    }
}
class Projectile extends Vector  // LASER
{
    constructor()
    {
        super(20, 35);
        this.lasers = [];
        this.laser = new Laser;
        this.amout = 0;
        this.fire = false;
        this.hit = false;
    }
    draw()
    {
        for (var i = 0; i < this.lasers.length; i++) {
            this.x = this.lasers[i][0];
            this.y = this.lasers[i][1];
            this.laser.init(this.x-8, this.y-20);
        }
        this.shoot();
        this.move();
    }

    move()
    {
        for (var i = 0; i < this.lasers.length; i++) {
            if (this.lasers[i][1] > -10) {
                this.lasers[i][1] -=15;
            }
            else if (this.lasers[i][1] < -9) this.lasers.splice(i, 1);
            if (this.hit) {
                this.lasers.splice(i, 1);
            }
        }
        this.hit = false;
    }

    shoot()
    {
        if (this.fire && this.lasers.length <= .1) {
            this.lasers.push([player.x+player.size.w/2-2, player.y]);
        }
        this.fire = false;
    }
}

class expSprite extends Sprite   // EXPLOSION - template
{
    constructor()
    {
        super('img/explosion_.png', 8, 6)
        this.size = {w:32*2.5, h:32*2.5}
    }
    init(x, y)
    {
        this.x = x;
        this.y = y;
        this.animate(0.4);  // frameSpeed set to 0.4
        this.update(0, 0, 5, 6);
    }
}
class Explosion extends Vector   // EXPLOSION
{
    constructor()
    {
        super();
        this.explosions = [];
        this.exp = new expSprite;
        this.hit = false;
        this.timer;
    }

    init()
    {
        for (var i = 0; i < this.explosions.length; i++) {
            this.x = this.explosions[i][0];
            this.y = this.explosions[i][1];
            this.exp.init(this.x, this.y);
        }
        this.update();
    }

    update()
    {
        for (var i = 0; i < this.explosions.length; i++)
        if (this.timer >= 15) {
            this.explosions.splice(i, 1);
            this.timer = 0;
            this.amount = 0;
        }

        if(this.hit && main.laser.lasers.length <= 0 && this.explosions.length <= .1)
         {
            this.explosions.push([player.x, main.laser.y]);
            this.timer = 0;
        }
        this.hit = false;
    }
}

const scoreBoard =
{
    size: 10,
    color: 'gold',
    hp: 10,
    score: 0,
    timer: 0,

    init: function(DT) {
        let C = new Canvas;
        this.timer = this.timer +DT;

        // draws game time //
        C.ctx.fillStyle = 'white';
        C.ctx.font = '15px Arial';
        C.ctx.fillText("Time :  "+Math.round(this.timer), 160, C.H-10);

        // draws score //
        C.ctx.fillStyle = 'gold';
        C.ctx.font = '15px Arial';
        C.ctx.fillText("Score :  "+Math.round(this.score), 30, C.H-10);
        for (let i = 0; i < this.score/10; i++)
        for (let j = 0; j < i; j++) {
            let y = -(12*j)+C.H-20; let x = 10;
            C.ctx.beginPath();
            C.ctx.lineWidth = '1';
            C.ctx.fillStyle = 'gold';
            C.ctx.fillRect(x, y, this.size, this.size);
            C.ctx.stroke();
            C.ctx.save();
        }

        // draws hps //
        C.ctx.fillStyle ='rgba(255, 25, 25, 0.8)';
        C.ctx.font = '17px Arial';
        C.ctx.fillText("HP "+this.hp, C.W-80, C.H-10);
        for (let i = 0; i < this.hp; i++) {
            let y = -(12*i)+C.H-20; let x = C.W-20;
            C.ctx.beginPath();
            C.ctx.lineWidth = '1';
            C.ctx.fillStyle ='brown';
            C.ctx.fillRect(x, y, this.size, this.size);
            C.ctx.stroke();
            C.ctx.save();
        }
    },
}



class Main extends Canvas      // MAIN
{
    constructor()
    {
        super();
        this.time = null;
        this.rocks = [];
        this.rockTotal = 8;
        this.create();
        this.loop();
    }

    create() // creates an instance of object (outside of game loop)
    {
        this.thunderBolt = new ThunderBolt;
        this.laser = new Projectile;
        this.explosion = new Explosion;

        for (var i = 0; i < this.rockTotal; i++)
            this.rocks.push(i);
        for(var i = 0; i < this.rocks.length; i++)
            this.rocks[i] = new Asteroid();
    }

    update(DT) // continuously updates - 60 fps
    {
        this.time++;
        this.explosion.timer++;
        scoreBoard.init(DT)
        player.init()
        this.laser.draw()
        this.explosion.init()
        this.collisionHandler()
        this.rocks.forEach(rock => rock.init())

        if(scoreBoard.hp <= 0) this.reset(); // resets game if HP = 0
    }

    collisionHandler()
    {
        for (let i in this.rocks)
        {
            if (this.collisionDetection(player, this.rocks[i])) {
                scoreBoard.hp -= 1;
                this.rocks.splice(i, 1);
                this.rocks.push(new Asteroid);
            }
            if (this.collisionDetection(this.laser, this.rocks[i])) {
                this.rocks.splice(i, 1);
                this.rocks.push(new Asteroid);
                this.laser.hit = true;
                scoreBoard.score += 1;
                this.explosion.hit = true;
            }
        }
    }

    collisionDetection(id_1, id_2)
    {
        return id_1.x+10 <= id_2.x + id_2.size.w
            && id_2.x+10 <= id_1.x + id_1.size.w
            && id_1.y+20 <= id_2.y + id_2.size.h
            && id_2.y+20 <= id_1.y + id_1.size.h
    }

    reset() // resets the game
    {
        scoreBoard.hp = 10;
        scoreBoard.score = 0;
        scoreBoard.timer = 0;
        this.rocks = [];
        this.create();
    }

    loop(lastTime) { // creates main loop
        const callback = (Mseconds) => {
            this.ctx.clearRect(0, 0, this.W, this.H);
            if(lastTime)
                this.update((Mseconds -lastTime)/1000);
            lastTime = Mseconds;
            requestAnimationFrame(callback);
        }
        callback();
    }
}



const player = new Player;        // initiates player
window.onload = main = new Main; // initiates game

