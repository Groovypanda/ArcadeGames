/**
 * Created by Jarre on 26-5-2017.
 */
//Global variables
const frameInterval = 100;
const gameInterval = 60;
const direction = {
    NONE: {x: 0, y: 0},
    UP: {x: 0, y: -1},
    DOWN: {x: 0, y: 1},
    LEFT: {x: -1, y: 0},
    RIGHT: {x: 1, y: 0}
}
let game;
let keyState = {};

Object.prototype.copy = function() {
    return JSON.parse(JSON.stringify(this));
}

window.onload = function () {
    game = new Game();
    game.createEntities();
    game.frameLoop();
    game.gameLoop();
    window.addEventListener('keydown',function(e){
        keyState[e.keyCode || e.which] = true;
    },true);

    window.addEventListener('keyup',function(e){
        keyState[e.keyCode || e.which] = false;
    },true);}

class Game {
    constructor(){
        this.canvas = document.getElementById('gameCanvas')
        this.context = this.canvas.getContext('2d')
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.center = {x: this.width/2, y: this.height/2}
    }

    createEntities(){
        let playerOffsetX = 40;
        this.player1 = new Player(playerOffsetX, 4);
        this.player2 = new Player(this.width - playerOffsetX, 2);
        this.ball = new Ball();
    }

    frameLoop() {
        let game = this
        setInterval(function () {
            game.context.beginPath()
            game.draw()
            game.player1.draw()
            game.player2.draw()
            game.ball.draw()
            game.context.closePath()
        }, 1000/frameInterval)
    }

    gameLoop() {
        let game = this
        setInterval(function() {
            if (keyState[40]){
                game.player1.move(direction.DOWN)
            }

            if (keyState[38]){
                game.player1.move(direction.UP)
            }
            game.ball.checkCollissions()
            if(game.ball.position.x < 0){
                game.player1.score++;
                game.ball.reset();
            }
            if(game.ball.position.x > game.width){
                game.player2.score++;
                game.ball.reset();
            }
            game.ball.move()
            game.player2.intelligentMove()
        }, 1000/gameInterval)
    }

    draw() {
        RenderHandler.drawRectangle(0, 0, this.width, this.height, 'black');
        RenderHandler.drawText(this.player1.score, this.width/4, 100)
        RenderHandler.drawText(this.player2.score, 3*this.width/4, 100)
    }


}

//A drawable entity
class Entity {
    /**
     * Create a new drawable entity
     * @param position The coordinate of the entity.
     * @param physicalProperties The physical properties of the entity such as width and height.
     * @param speed: The speed at which the entity can move.
     */
    constructor(position, physicalProperties, speed){
        this.position = position
        this.physicalProperties = physicalProperties
        this.speed = speed
    }
}

class Player extends Entity {
    constructor(x, speed){
        const width = 15;
        const height = 80;
        const color = 'white'
        super(
            {x, y: game.center.y},
            {width, height, color},
            speed);
        this.score = 0
    }

    draw(){
        RenderHandler.drawRectangle(this.position.x - this.physicalProperties.width/2, this.position.y - this.physicalProperties.height/2,
            this.physicalProperties.width, this.physicalProperties.height, this.physicalProperties.color);
    }

    move(direction){
        if((((this.position.y + this.physicalProperties.height/2) < game.height) && direction.y > 0) ||
            (((this.position.y - this.physicalProperties.height/2) > 0) && direction.y < 0)) {
            this.position.y += this.speed * direction.y
        }
    }

    intelligentMove(){
        if(game.ball.position.y < this.position.y){
            this.move(direction.UP)
        }
        if(game.ball.position.y > this.position.y){
            this.move(direction.DOWN)
        }
    }
}

class Ball extends Entity {
    constructor(){
        const speed = 5;
        const color = 'white';
        const radius = 12;
        super(
            game.center.copy(),
            {radius, color},
            speed,
        );
        this.direction = {};
        this.startPosition = game.center;
        this.reset()
    }

    draw(){
        RenderHandler.drawCircle(this.position.x, this.position.y, this.physicalProperties.radius, this.physicalProperties.color);
    }

    move(){
        this.position.x += this.speed * this.direction.x
        this.position.y += this.speed * this.direction.y
    }

    reset(){
        let angle = Math.random()/2
        if(Math.random()< 0.5){
            angle*=-1
        }
        this.position.x = this.startPosition.x
        this.position.y = this.startPosition.y
        this.direction.x = Math.cos(angle)
        this.direction.y = Math.sin(angle)
        if(Math.random() < 0.5){
            this.position.x*=1
        }
    }

    //Check if this object and the other entity collide
    checkCollissions(){
        if((this.direction.y < 0 && this.position.y < 0) ||
            (this.direction.y > 0 && this.position.y > game.height)){
            this.direction.y*=-1
        }
        else {
            let player = game.ball.direction.x < 0 ? game.player1 : game.player2
            let circleDistance = {}
            circleDistance.x = this.position.x - player.position.x;
            circleDistance.y = this.position.y - player.position.y;
            if(Math.abs(circleDistance.x) <= player.physicalProperties.width/2 &&
                Math.abs(circleDistance.y) <= player.physicalProperties.height/2){
                this.direction = {x: -this.direction.x, y: Math.sin(circleDistance.y/(player.physicalProperties.height/2))}
            }
        }

    }

}

class RenderHandler {
    static drawRectangle(x, y, width, height, color) {
        game.context.fillStyle = color;
        game.context.fillRect(x, y, width, height);
    }

    static drawCircle(x, y, radius, color) {
        game.context.fillStyle = color;
        game.context.arc(x, y, radius, 0, 2*Math.PI);
        game.context.fill();
    }

    static drawText(text, x, y, color){
        game.context.font = "50px Arial";
        game.context.fillStyle = color ? color: 'white';
        game.context.fillText(text, x, y);
    }
}




