
let keyState = null;
let snake = {};
let rows = 30; //Amount of rows;
let columns = 30; //Amount of columns;
let size = 16; //Size of a cell;
let food = [];

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
    createCanvas(size*rows+1, size*columns+1)
    frameRate(10)
    window.addEventListener('keydown',function(e){
        if(e.keyCode >= 37 && e.keyCode <= 40)  keyState = e.keyCode
    },true);
    snake = new Snake(rows/2, columns/2)
    food.push(new Food())
}



function draw(){
    background('black')
    snake.update()
    snake.show()
    for(let i=0; i<food.length; i++){
        food[i].show()
    }
}

class Food {
    constructor(){
        this.x = floor(random(rows))
        this.y = floor(random(columns))
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
        this.speed = 1
        this.head = new SnakePiece(x, y)
        this.tail = this.head
        this.direction = direction.NONE
        this.x = x
        this.y = y
        for(var i=0; i<10; i++){
            this.addPiece()
        }
    }

    update(){
        this.direction = keyState === null ? direction.NONE : keyDirection[keyState]
        this.x += this.speed*this.direction.x
        this.y += this.speed*this.direction.y
        this.head.update({x: this.x, y: this.y})
    }

    addPiece(){
        let piece = new SnakePiece()
        this.tail.setNext(piece)
        this.tail = piece
    }

    show(){
        this.head.show()
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