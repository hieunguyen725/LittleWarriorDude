var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, startY, warriorMoving) {
    if (warriorMoving) {
        this.elapsedTime += tick;
    } else {
        this.elapsedTime = 0;
    }
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight + startY, // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y);
};

Background.prototype.update = function () {};

// myspritesheet 
function Warrior(game, walkingSprite, runningSprite) {
    this.walkingAnimation = new Animation(walkingSprite, 70, 69, 8, .2, 8, true, 1);
    this.runningAnimation = new Animation(runningSprite, 70, 69, 8, .08, 8, true, 1);
    this.speed = 100;
    this.x = 200;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
}

Warrior.prototype.update = function () {
    // check if this warrior is moving at all
    if (this.game.warriorMoving) {
        
        // change speed if running
        if (this.game.warriorRunning) {
            this.speed = 200;
        } else {
            this.speed = 100;
        }
        
        // speed according to direction
        if (this.game.warriorDirection === "down") {
            this.y += this.game.clockTick * this.speed;
            if (this.y > 400) {
                this.y = -50;
            }
        } else if (this.game.warriorDirection === "up") {
            this.y -= this.game.clockTick * this.speed;
            if (this.y <= -50) {
                this.y = 400;
            }
        } else if (this.game.warriorDirection === "left") {
            this.x -= this.game.clockTick * this.speed;
            if (this.x <= -50) {
                this.x = 700;
            }
        } else if (this.game.warriorDirection === "right") {
            this.x += this.game.clockTick * this.speed;
            if (this.x > 700) {
                this.x = -50;
            }
        }
    }
}

Warrior.prototype.draw = function () {
    var startY = 0;
    // change source y-coordinate of the spritesheet base on
    // current direction that the warrior is moving
    if (this.game.warriorDirection === "up") {
        startY = 210;
    } else if (this.game.warriorDirection === "down") {
        startY = 0;

    } else if (this.game.warriorDirection === "left") {
        startY = 70;

    } else if (this.game.warriorDirection === "right") {
        startY = 140;
    }
    if (this.game.warriorRunning) {
        this.runningAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, startY, this.game.warriorMoving);
    } else {
        this.walkingAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, startY, this.game.warriorMoving);
    }
}

AM.queueDownload("./img/grass_background.jpg");
AM.queueDownload("./img/WarriorWalking.png");
AM.queueDownload("./img/WarriorRunning.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/grass_background.jpg")));
    gameEngine.addEntity(new Warrior(gameEngine, 
                                     AM.getAsset("./img/WarriorWalking.png"),
                                     AM.getAsset("./img/WarriorRunning.png")));
});