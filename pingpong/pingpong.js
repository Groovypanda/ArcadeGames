/**
 * Created by Jarre on 26-5-2017.
 */

//Global variables
let canvas
let context
let boardWidth;
let boardHeight;
let player1;
let player2;
let ball;
let frameInterval = 100
let gameInterval = 60
let finished = false

window.onload = function() {
    prepareGame()
    frameLoop()
    gameLoop()
    respondToInput()
}

frameLoop = function(){
    setInterval(function () {
        drawEntities()
    }, 1000/frameInterval)
}

gameLoop = function(){
    setInterval(function() {
        ball.position.x += ball.speed
    }, 1000/gameInterval)
}

respondToInput = function() {
    $(document).keydown(function(e){
        switch(e.keyCode){
            case 38: //Up
                player1.position.y -= player1.speed
                break;
            case 40: //Down
                player1.position.y += player1.speed
                break;
        }
    })
}

prepareGame = function(){
    createCanvas()
    createPlayers()
    ball = createBall()
}

createCanvas = function(){
    canvas = document.getElementById('gameCanvas')
    context = canvas.getContext('2d')
    boardWidth = canvas.width
    boardHeight = canvas.height
}


createPlayers = function(){
    let speed = 6
    let playerHeight = 80
    let playerWidth = 15
    let playerOffsetX = 40
    let playerOffsetY = getCenterY(playerHeight)
    player1 = createPlayer(playerOffsetX, playerOffsetY, playerWidth, playerHeight, speed)
    player2 = createPlayer(boardWidth-playerOffsetX, playerOffsetY, playerWidth, playerHeight, speed)
}

createPlayer = function(x, y, width, height, speed){
    let color = 'white'
    return {position: {x, y}, width, height, color, speed}
}

createBall = function(){
    let speed = 3
    let color = 'white'
    let radius = 12
    let x = getCenterX(radius)
    let y = getCenterY(radius)
    return {position: {x, y}, radius, color, speed}
}

drawRectangle = function(x, y, width, height, color){
    context.fillStyle = color
    context.fillRect(x, y, width, height)
}

drawCircle = function(x, y, radius, color){
    context.fillStyle = color
    context.arc(x, y, radius, 0, 2*Math.PI)
    context.fill()
}

//Get the center of the y-axis given the objects height.
getCenterY = function(height){
    return boardHeight/2 - height/2
}

//Get the center of the x-axis given the objects height.
getCenterX = function(width){
    return boardWidth/2 - width/2
}

drawEntities = function(){
    context.beginPath()
    drawRectangle(0, 0, boardWidth, boardHeight, 'black')
    drawRectangle(player1.position.x, player1.position.y, player1.width, player1.height, player1.color)
    drawRectangle(player2.position.x, player2.position.y, player2.width, player2.height, player2.color)
    drawCircle(ball.position.x, ball.position.y, ball.radius, ball.color)
}



