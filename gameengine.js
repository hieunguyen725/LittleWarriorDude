window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.warriorDirection = null;
    this.warriorMoving = null;
    this.warriorRunning = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
}

GameEngine.prototype.start = function () {
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    var that = this;
    this.ctx.canvas.addEventListener("keydown", function (e) {
        // set warriorMoving to true if any arrow key is pressed down.
        if (e.keyCode === 38 || e.keyCode == 40 || e.keyCode == 37 || e.keyCode == 39) {
            that.warriorMoving = true;
        }

        // store the current direction base on the current arrow key
        if (e.keyCode === 38) {
            that.warriorDirection = "up";
        } else if (e.keyCode === 40) {
            that.warriorDirection = "down";

        } else if (e.keyCode === 37) {
            that.warriorDirection = "left";

        } else if (e.keyCode === 39) {
            that.warriorDirection = "right";
        }

        // if space bar is pressed, warrior running is true
        if (e.keyCode === 32) {
            that.warriorRunning = true;
        }

    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        // set warriorMoving to false if an arrow key is released
        if (e.keyCode === 38 || e.keyCode == 40 || e.keyCode == 37 || e.keyCode == 39) {
            that.warriorMoving = false;
        }

        // set to run / walk faster to false if spacebar is released.
        if (e.keyCode === 32) {
            that.warriorRunning = false;
        }
    }, false);
}

GameEngine.prototype.addEntity = function (entity) {
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        entity.update();
    }
}

GameEngine.prototype.loop = function () {
    if (!this.warriorMoving) {
        this.clockTick = this.timer.tick();
    }
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
}

Entity.prototype.update = function () {}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}