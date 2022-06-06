const board = document.querySelector("#canvas")
const levelDiv = document.querySelector("#levelDiv")
const levelBox = document.querySelector("#levelBox")
const blocksHeight = 30
const blocksWidth = 110
const ballHeight = 20
const ballWeight = 20
const congartzMessageDisplay = document.querySelector("#congartzMessage")
const nextLevelButtonDisplay = document.querySelector("#nextLevelButton")
const usersLocation = [] // [xAxis-yAxis] --> [left-top]
class Block{
    constructor(left,top){ // left --x axis // top --y axis
        this.topLeft  = [left,top],
        this.topRight = [left + blocksWidth , top],
        this.bottomRight = [left + blocksWidth , top + blocksHeight],
        this.bottomLeft = [left, top + blocksHeight]
    }
}
nextLevelButtonDisplay.removeEventListener(("click"),()=>{})
let levelCounter = 0
let levelCheck = 0 
const levels = [
    {
        level: 1,
        blocksArray:[
            new Block(60,50),
            new Block(190,50),
            new Block(320,50),
            new Block(450,50),
            new Block(580,50),
            new Block(710,50),
            new Block(840,50),
            new Block(60,90),
            new Block(190,90),
            new Block(320,90),
            new Block(450,90),
            new Block(580,90),
            new Block(710,90),
            new Block(840,90),
        ],
        ballSpeed: 6,
        playersBlock: new Block(450,450)
    },
    {
        level: 2,
        blocksArray:[
        new Block(60,50),
        new Block(320,50),
        new Block(580,50),
        new Block(840,50),
        new Block(60,90),
        new Block(320,90),
        new Block(580,90),
        new Block(840,90),
        new Block(60,130),
        new Block(320,130),
        new Block(580,130),
        new Block(840,130),
        ],
        ballSpeed: 8,
        playersBlock: new Block(450,450)
    },
    {
        level: 3,
        blocksArray:[
            new Block(60,50),
            new Block(320,50),
            new Block(580,50),
            new Block(840,50),
            new Block(190,90),
            new Block(450,90),
            new Block(710,90),
            new Block(60,130),
            new Block(320,130),
            new Block(580,130),
            new Block(840,130),
        ],
        ballSpeed: 10,   
        playersBlock: new Block(450,450)
    }
]
function levelNumberChange(){
    levelBox.textContent = "Level-" + levels[levelCounter]["level"]
}
levelNumberChange()
function createBlocks(){
    for(let i = 0 ; i < levels[levelCounter]["blocksArray"].length ; i++){
        const block = document.createElement("div")
        block.setAttribute("class","block")
        board.appendChild(block)
        block.style.left = levels[levelCounter]["blocksArray"][i]["topLeft"][0] + "px"
        block.style.top = levels[levelCounter]["blocksArray"][i]["topLeft"][1] + "px"
    }
}
createBlocks()
const block = document.createElement("div")

function createUser(){
    block.classList.add("usersBlock")
    board.appendChild(block)
    usersLocation[0] = levels[levelCounter]["playersBlock"]["topLeft"][0]
    usersLocation[1] = levels[levelCounter]["playersBlock"]["topLeft"][1]
}
createUser()
function usersActionsResults(){
    block.style.left = usersLocation[0] + "px"
    block.style.top = usersLocation[1] + "px"
}
usersActionsResults()

function usersAction(e){
    switch(e.key){
        case "ArrowLeft":
            if(usersLocation[0] > 0 ){
                usersLocation[0] -= 15
                usersActionsResults()
            }
        break;
        case "ArrowRight":
            if(usersLocation[0] < 1000 - blocksWidth ){ // 1000 equals to canvasWidth
                usersLocation[0] += 15
                usersActionsResults()
            }
        break;
    }
}
document.addEventListener("keydown",usersAction)

let ballPosition = [usersLocation[0] + 40, usersLocation[1] - 25]
const ball = document.createElement("div")
let ballsXchange = levels[levelCounter]["ballSpeed"]
let ballsYchange = levels[levelCounter]["ballSpeed"]
ball.classList.add("ball")
board.append(ball)
function ballDraw(){
    ball.style.left = ballPosition[0] + "px"
    ball.style.top = ballPosition[1] + "px"
}
ballDraw()
function ballsActionResults(){
    ballPosition[0] += ballsXchange
    ballPosition[1] -= ballsYchange
    ballDraw()
    ballHitsBarriers()
}
timer = setInterval(ballsActionResults,30)
function ballHitsBarriers(){
    //wall
    if(ballPosition[0] >= 980 ||
        ballPosition[0] < 20 ||
        ballPosition[1] >= 500 ||        
        ballPosition[1] < 0 ){// 1000 equals to canvasWidth // 20 equals ballsWidth
        changeDirections()
    }
    //blocks
    for(let i = 0 ; i < levels[levelCounter]["blocksArray"].length ; i++){
        if(ballPosition[0] > levels[levelCounter]["blocksArray"][i].bottomLeft[0] &&
            ballPosition[0] < levels[levelCounter]["blocksArray"][i].bottomRight[0] &&
            ballPosition[1] + 20 < levels[levelCounter]["blocksArray"][i].bottomRight[1] &&
            ballPosition[1] + 20> levels[levelCounter]["blocksArray"][i].topRight[1])
            {
                const allblocksThatLeft = Array.from(document.querySelectorAll(".block"))
                allblocksThatLeft[i].classList.remove("block")
                levels[levelCounter]["blocksArray"].splice(i,1)
                if(levels[levelCounter]["blocksArray"].length == 0){
                    clearInterval(timer)
                    nextLevel()
                    levelCheck++
                }
                changeDirections()
            }
    }
    //user
    if(
        ballPosition[0] > usersLocation[0] &&
        ballPosition[0] < usersLocation[0] + blocksWidth &&
        ballPosition[1] < usersLocation[1] &&
        ballPosition[1] > usersLocation[1] - blocksHeight)
        {
            changeDirections()
        }
}
function changeDirections(){
    if(ballPosition[1] >= 480 ){
        clearInterval(timer)
        gameOver()
        return
    }
    else{
        //user
        if(ballsXchange === -levels[levelCounter]["ballSpeed"] && 
        ballsYchange === -levels[levelCounter]["ballSpeed"] && 
        ballPosition[0] > usersLocation[0] - 10&&
        ballPosition[0] < usersLocation[0] + blocksWidth + 10&&
        ballPosition[1] < usersLocation[1] &&
        ballPosition[1] > usersLocation[1] - blocksHeight - 5){
            ballsYchange = levels[levelCounter]["ballSpeed"]
        }
        else if(ballsXchange === levels[levelCounter]["ballSpeed"] && 
        ballsYchange === -levels[levelCounter]["ballSpeed"] && 
        ballPosition[0] > usersLocation[0] &&
        ballPosition[0] < usersLocation[0] + blocksWidth &&
        ballPosition[1] < usersLocation[1] &&
        ballPosition[1] > usersLocation[1] - blocksHeight - 5){
            ballsYchange = +levels[levelCounter]["ballSpeed"]
        }//wall
        else if(ballsXchange === levels[levelCounter]["ballSpeed"] && ballsYchange === levels[levelCounter]["ballSpeed"] && ballPosition[0] >= 1000 - 40){
            ballsXchange = -levels[levelCounter]["ballSpeed"]
            return
        }
        else if(ballsXchange === levels[levelCounter]["ballSpeed"] && ballsYchange === levels[levelCounter]["ballSpeed"] && ballPosition[1] < 20){
            ballsYchange = -levels[levelCounter]["ballSpeed"]
            return
        }
        else if(ballsXchange === levels[levelCounter]["ballSpeed"] && ballsYchange === -levels[levelCounter]["ballSpeed"] && ballPosition[0] >= 1000 - 40){
            ballsXchange = -levels[levelCounter]["ballSpeed"]
            return
        }
        else if(ballsXchange === -levels[levelCounter]["ballSpeed"] && ballsYchange === levels[levelCounter]["ballSpeed"] && ballPosition[1] < 20){
            ballsYchange = -levels[levelCounter]["ballSpeed"]
            return
        }
        else if(ballsXchange === -levels[levelCounter]["ballSpeed"] && ballsYchange === -levels[levelCounter]["ballSpeed"] && ballPosition[0] <= 20){
            ballsXchange = levels[levelCounter]["ballSpeed"]
            return
        }
        else if(ballsXchange === -levels[levelCounter]["ballSpeed"] && ballsYchange === levels[levelCounter]["ballSpeed"] && ballPosition[0] <= 20){
            ballsXchange = levels[levelCounter]["ballSpeed"]
            return
        }
        //blocks
        else if(ballsXchange === levels[levelCounter]["ballSpeed"] && ballsYchange === levels[levelCounter]["ballSpeed"]){
            ballsYchange = -levels[levelCounter]["ballSpeed"]
            return
        }
        else if(ballsXchange === -levels[levelCounter]["ballSpeed"] && ballsYchange === levels[levelCounter]["ballSpeed"]){
            ballsYchange = -levels[levelCounter]["ballSpeed"]
            return
        }
        else if(ballsXchange === levels[levelCounter]["ballSpeed"] && ballsYchange === -levels[levelCounter]["ballSpeed"]){
            ballsXchange = -levels[levelCounter]["ballSpeed"]
            return
        }
        else if(ballsXchange === -levels[levelCounter]["ballSpeed"] && ballsYchange === -levels[levelCounter]["ballSpeed"]){
            ballsXchange = levels[levelCounter]["ballSpeed"]
            return
        }
    }
}

function gameOver(){
    congartzMessageDisplay.textContent = "GAME OVER YOU LOSE!"
    congartzMessageDisplay.style.opacity = 1

    congartzMessageDisplay.addEventListener(("click"),()=>{
        window.location.reload()
    })
    document.removeEventListener(("keydown"),usersAction)
}
const page = document.querySelector("#page")
const body = document.querySelector("body")
const thankPage = document.querySelector("#thanks-box-container")
function nextLevel(){
    congartzMessageDisplay.textContent = "CONGARTZ YOU WIN!"
    congartzMessageDisplay.style.opacity = 1
    nextLevelButtonDisplay.style.opacity = 1
    nextLevelButtonDisplay.style.zIndex = 0
}
function nextLevelButton(){
    if(levelCounter == levels.length - 1){
        thankPage.style.opacity = 1
        body.removeChild(page)
    }
    else{
        console.log(levelCounter)
        levelCounter++
        console.log(levelCounter)
        congartzMessageDisplay.style.opacity = 0
        nextLevelButtonDisplay.style.opacity = 0
        nextLevelButtonDisplay.style.zIndex = -99
        ballPosition = [usersLocation[0] + 40, usersLocation[1] - 25]
        ballsXchange = levels[levelCounter]["ballSpeed"]
        ballsYchange = levels[levelCounter]["ballSpeed"]
        timer = setInterval(ballsActionResults,30)
        levelNumberChange()
        createBlocks()
        ballDraw()
        ballsActionResults()
}
}