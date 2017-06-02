
let keyState = null;
let snake = {};
let rows = 30; //Amount of rows;
let columns = 30; //Amount of columns;
let size = 16; //Size of a cell;
let gameWidth = rows*size+1
let gameHeight = size*columns+1
let food = [];
let atStartup = true
let difficulty = 0

const direction = {
    NONE: {x: 0, y: 0},
    UP: {x: 0, y: -1},
    DOWN: {x: 0, y: 1},
    LEFT: {x: -1, y: 0},
    RIGHT: {x: 1, y: 0}
}
const keyDirection = {
    37: direction.LEFT,
    38: direction.UP,
    39: direction.RIGHT,
    40: direction.DOWN
}

function setup(){
    createCanvas(gameWidth, gameHeight)
    showStartScreen()
    frameRate(10)
    window.addEventListener('keydown',function(e){
        if(e.keyCode >= 37 && e.keyCode <= 40)  keyState = e.keyCode
    },true);
}

function showStartScreen(){
    let difficulties = ['Easy', 'Medium', 'Hard']
    let difficultieValues = [1, 0.2, 0.5]
    for(let i=0; i<difficulties.length; i++){
        let button = createButton(difficulties[i]);
        let buttonWidth = 100
        button.size(buttonWidth, 40)
        button.position(((i+1)*gameWidth)/(difficulties.length+1)-buttonWidth/2, gameHeight/2)
        button.mousePressed(() => {
            atStartup = false
            difficulty = difficultieValues[i]
            snake = new Snake(rows/2, columns/2)
            food.push(new Food())
            removeElements(); //Remove all of the buttons
        })
    }

}

function draw(){
    background('black')
    if(!atStartup) {
        snake.update()
        snake.show()
        for(let i=0; i<food.length; i++){
            food[i].show()
        }
    }

}

class Food {
    constructor(){
        this.x = round(random(rows))
        this.y = round(random(columns))
    }

    show(x, y){
        fill('yellow')
        let width = size
        let height = size
        rect(size*this.x, size*this.y, size, size);
    }
}


class Snake {
    constructor(x, y) {
        this.speed = difficulty
        this.head = new SnakePiece(x, y)
        this.direction = direction.NONE
        this.originalPosition = {x, y}
        this.reset()
    }

    update(){
        //Update direction and position
        let newDirection = keyState === null ? direction.NONE : keyDirection[keyState]
        if(this.length ===  1 || (newDirection.x !== -this.direction.x || newDirection.y !== -this.direction.y)) this.direction = newDirection
        this.x += this.speed*this.direction.x
        this.y += this.speed*this.direction.y
        this.head.update({x: this.x, y: this.y})
        //Check for collissions with snake
        let piece = this.head.next
        while(piece!==null && !(this.x === piece.x && this.y === piece.y)){
            piece = piece.next
        }
        //If a collission occurred then reset the snake
        if(piece!==null || this.x > rows || this.x < 0 || this.y > columns || this.y < 0){
            this.reset()
        }
        //Check if food can be eaten
        for(let i=0; i<food.length; i++){
            if(this.x === food[i].x && this.y === food[i].y){
                this.eat(i)
            }
        }
    }

    //i indicates which piece of food should be eaten
    eat(i){
        this.addPiece()
        food.splice(i, 1)
        food.push(new Food())
    }

    addPiece(){
        let piece = new SnakePiece()
        this.tail.setNext(piece)
        this.tail = piece
        this.length++
    }

    show(){
        this.head.show()
    }

    reset(){
        this.length = 1
        this.head.next = null
        this.tail = this.head
        this.x = this.originalPosition.x
        this.y = this.originalPosition.y
        this.direction = direction.NONE
    }
}

class SnakePiece {
    constructor() {
        this.next = null
    }

    setNext(piece){
        this.next = piece
    }

    update(position){
        let oldPosition = {x: this.x, y: this.y}
        this.x = position.x
        this.y = position.y
        if(this.next) this.next.update(oldPosition)
    }

    show(){
        fill('white')
        rect(size*this.x, size*this.y, size, size);
        if(this.next){
            this.next.show()
        }
    }
}