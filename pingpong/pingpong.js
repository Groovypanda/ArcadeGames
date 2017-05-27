/**
 * Created by Jarre on 26-5-2017.
 */
//Global variables
const frameInterval = 100;
const gameInterval = 60;
const direction = {
    UP: {x: 0, y: -1},
    DOWN: {x: 0, y: 1},
    LEFT: {x: -1, y: 0},
    RIGHT: {x: 1, y: 0}
}
let game;
let renderHandler;

window.onload = function () {
    renderHandler = new RenderHandler();
    game = new Game();
    game.createEntities();
    game.frameLoop();
    game.gameLoop();
    game.respondToInput();
}

class Game {
    constructor(){
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width
        this.height = this.canvas.height
    }

    createEntities(){
        let playerOffsetX = 40;
        this.player1 = new Player(playerOffsetX)
        this.player2 = new Player(this.width - playerOffsetX)
        this.ball = new Ball()
    }

    frameLoop() {
        let game = this
        setInterval(function () {
            game.context.beginPath();
            game.draw()
            game.player1.draw()
            game.player2.draw()
            game.ball.draw()

        }, 1000/frameInterval)
    }

    gameLoop() {
        let game = this
        setInterval(function() {
            game.ball.position.x += game.ball.speed;
        }, 1000/gameInterval)
    }

    respondToInput() {
        let game = this
        $(document).keydown(function(e){
            switch(e.keyCode){
                case 38: //Up
                    game.player1.move(direction.UP)
                    break;
                case 40: //Down
                    game.player1.move(direction.DOWN)
                    break;
            }
        })
    }

    draw() {
        renderHandler.drawRectangle(0, 0, this.width, this.height, 'black');
    }

    //Get the center of the y-axis given the objects height.
    getCenterY(height) {
        return this.height/2 - height/2;
    }

    //Get the center of the x-axis given the objects height.
    getCenterX(width) {
        return this.width/2 - width/2;
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
    constructor(x){
        const speed = 6;
        const width = 15;
        const height = 80;
        const color = 'white'
        super({x, y: game.getCenterY(height)}, {width, height, color}, speed);
    }

    draw(){
        renderHandler.drawRectangle(this.position.x, this.position.y,
            this.physicalProperties.width, this.physicalProperties.height, this.physicalProperties.color);
    }

    move(direction){
        this.position.y += this.speed * direction.y
    }
}

class Ball extends Entity {
    constructor(){
        const speed = 3;
        const color = 'white';
        const radius = 12;
        super({x: game.getCenterX(radius), y: game.getCenterY(radius)}, {radius, color}, speed);
    }

    draw(){
        renderHandler.drawCircle(this.position.x, this.position.y, this.physicalProperties.radius, this.physicalProperties.color);
    }

    move(directionX, directionY){
        this.position.x += directionX.x
        this.position.y += directionY.y
    }
}

class RenderHandler {
    drawRectangle(x, y, width, height, color) {
        game.context.fillStyle = color;
        game.context.fillRect(x, y, width, height);
    }

    drawCircle(x, y, radius, color) {
        game.context.fillStyle = color;
        game.context.arc(x, y, radius, 0, 2*Math.PI);
        game.context.fill();
    }
}




