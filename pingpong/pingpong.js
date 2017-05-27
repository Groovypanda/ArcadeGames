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

Object.prototype.copy = function() {
    return JSON.parse(JSON.stringify(this));
}

window.onload = function () {
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
        this.center = {x: this.width/2, y: this.height/2}
    }

    createEntities(){
        let playerOffsetX = 40;
        this.player1 = new Player(playerOffsetX);
        this.player2 = new Player(this.width - playerOffsetX);
        this.ball = new Ball();
    }

    frameLoop() {
        let game = this
        setInterval(function () {
            if(game.ball.collide(game.player2) || game.ball.collide(game.player1)){
                game.ball.direction = game.ball.direction === direction.RIGHT ? direction.LEFT : direction.RIGHT ;
            }
            if(game.ball.position.x < 0){
                game.player1.score++;
                game.ball.reset();
            }
            if(game.ball.position.y > this.width){
                game.player2.score++;
                game.ball.reset();
            }
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
            game.ball.move()
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
    constructor(x){
        const speed = 6;
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
        this.position.y += this.speed * direction.y
    }
}

class Ball extends Entity {
    constructor(){
        const speed = 4;
        const color = 'white';
        const radius = 12;
        super(
            game.center.copy(),
            {radius, color},
            speed,
        );
        this.direction = direction.RIGHT;
        this.startPosition = game.center;
    }

    draw(){
        RenderHandler.drawCircle(this.position.x, this.position.y, this.physicalProperties.radius, this.physicalProperties.color);
    }

    move(){
        this.position.x += this.speed * this.direction.x
    }

    reset(){
        this.position.x = this.startPosition.x
        this.position.y = this.startPosition.y
        this.direction = direction.RIGHT;
    }

    //Check if this object and the other entity collide
    collide(player){
        if(player instanceof Player){
            let circleDistance = {}
            circleDistance.x = Math.abs(this.position.x - player.position.x);
            circleDistance.y = Math.abs(this.position.y - player.position.y);
            if (circleDistance.x > (player.physicalProperties.width/2 + this.physicalProperties.radius)) { return false; }
            if (circleDistance.y > (player.physicalProperties.height/2 + this.physicalProperties.radius)) { return false; }

            if (circleDistance.x <= (player.physicalProperties.width/2)) { return true; }
            if (circleDistance.y <= (player.physicalProperties.height/2)) { return true; }

            let cornerDistance_sq = (circleDistance.x - player.physicalProperties.width/2)^2 +
                (circleDistance.y - player.physicalProperties.height/2)^2;
            return (cornerDistance_sq <= (Math.pow(this.physicalProperties.radius, 2)));
        }
        return false
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




