const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
c.fillRect(0,0, canvas.width, canvas.height)
let x_pos = 0
let blockNUM
let gridArray = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];

var j = 0
const gravity = 0.3

let z=1
class circle {
    constructor({position, velocity, color, currIteration, landed, enter}) {
        this.position = position
        this.velocity = velocity
        this.color = color
        this.height = 50
        this.currIteration = currIteration
        this.landed = landed
        this.enter = enter
    }
    draw() {
        //c.fillStyle = this.color
        //c.fillRect(this.position.x, this.position.y, this.height, 50)
        c.beginPath()
        c.arc(this.position.x + 25,this.position.y + 25,25,0,2*Math.PI)
        c.fillStyle = this.color
        c.fill()
        c.stroke()
    }
    update(blockNUM) {
        this.draw();
        if (checkCollision(this.position.y + this.height, blockNUM) == true) {
            this.velocity.y = 0
            this.landed = true
            this.position.y = getHeight(blockNUM)
            this.enter = false
            for (let i = 6; i >=0; i -= 1) {
                if (gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] == 0 || gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] == blockNUM) {
                    gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] = blockNUM
                    break
                }
            }
        }

        else if (this.position.y + this.height >= canvas.height - 95) {
          this.velocity.y = 0
          this.landed = true
          this.enter = false
          for (let i = 6; i >=0; i -= 1) {
                if (gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] == 0 || gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] == blockNUM) {
                    gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] = blockNUM
                    break
                }
            }
        } 
        
        else if (this.enter == true && this.landed == false) {
            this.position.y += this.velocity.y
            this.velocity.y += gravity
        }

        else {
            this.velocity.y = 0
        }
    }
}

let blockArray = []
for (let i = 0; i < 42; i += 1) {
    let temp_i = i + 1
    let temp_color
    if (temp_i % 2 == 0) {
        temp_color = 'green'
    }
    else {
        temp_color = 'red'
    }
    mainBlock = new circle({
        position: {
            x: 0,
            y: 0
        },

        velocity: {
            x: 0,
            y: 0
        },
        currIteration: i + 1,
        color: temp_color,
        landed: false,
        enter: false
       
    })
    blockArray.push(mainBlock)
}

function checkCollision(currBottom, blockNUM) {
    let j = 0
    for (let i = 6; i >=0 ; i -= 1) {
        if (gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] != 0) {
            j += 1
        }
        if (gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] == blockNUM) {
            return true
        }
    }
    if (currBottom >= canvas.height-95-(50*j)) {
        return true
    }
    else {
        return false
    }
}

function getHeight(blockNUM) {
    let j = 0
    for (let i = 6; i >=0 ; i -= 1) {
        if (gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] == blockNUM || gridArray[i][(blockArray[blockNUM - 1].position.x / 50)] == 0) {
            return (canvas.height - 95 - ((6-i)*50))
        }
    }
    return 0
}

//let continu = true

function animate() {
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    blockArray[0].update(1)
    let i = 1
    while (i < 42) {
        if (blockArray[i-1].landed == true) {
            blockArray[i].update(i + 1)
            
        }
        i += 1
    }
    checkWinner()
    window.requestAnimationFrame(animate)
}
let animationId = requestAnimationFrame(animate)

function resetGame() {
    location.reload()
}

function undo() {
    z -= 1
    let temp_x_pos = blockArray[z-1].position.x/50
    let i = 0;
    while (gridArray[i][x_pos] == 0) {
        i += 1
    }
    gridArray[i][temp_x_pos] = 0
    blockArray[z-1].enter = false
    blockArray[z-1].position.x = 0
    blockArray[z-1].position.y = 0
    blockArray[z-1].velocity.y = 0
    blockArray[z-1].landed = false

}
window.addEventListener('keypress',(event) => {
    console.log(event.key)
    if (checkWinner() != 1) {
    switch (event.key) {
        case 'Enter':
            if (gridArray[0][(blockArray[z-1].position.x/50)] != 0) {
                window.alert('Not a possible placement! Try again')
                break
            }
            else {
                blockArray[z-1].enter = true
                x_pos= 0
                z += 1
                break
            }
        case 'a':
            if (blockArray[z-1].position.x > 0) {
                blockArray[z-1].position.x -= 50
                x_pos -= 1
                break
            }
        case 'd':
            if (blockArray[z-1].position.x < 250) {
                blockArray[z-1].position.x += 50
                x_pos += 1
                break
            }
        case 'p':
            if (checkWinner() == 1) {
                cancelAnimationFrame(animationId)
            }
            console.log(gridArray)
    
    }
}
})

let count = 0

function checkWinner() {
    //check horizontal
    for (let i = 0; i < 7; i += 1) {
        for(let j = 0; j < 3; j += 1) {
            if ((gridArray[i][j] != 0 && gridArray[i][j + 1] != 0 && gridArray[i][j + 2] != 0 && gridArray[i][j + 3] != 0) &&
            (gridArray[i][j] % 2 == 0 && gridArray[i][j + 1] % 2 == 0 && gridArray[i][j + 2] % 2 == 0 && gridArray[i][j + 3] % 2 == 0)) {
                document.getElementById("foregroundText").innerHTML='Player 2 has won!'
                return  1
            }
        }  
    }
    for (let i = 0; i < 7; i += 1) {
        for(let j = 0; j < 3; j += 1) {
            if ((gridArray[i][j] != 0 && gridArray[i][j + 1] != 0 && gridArray[i][j + 2] != 0 && gridArray[i][j + 3] != 0) &&
            (gridArray[i][j] % 2 == 1 && gridArray[i][j + 1] % 2 == 1 && gridArray[i][j + 2] % 2 == 1 && gridArray[i][j + 3] % 2 == 1)) {
                document.getElementById("foregroundText").innerHTML='Player 1 has won!'
                return  1
            }
        }  
    }


    //check down
    for (let i = 0; i < 4; i += 1) {
        for(let j = 0; j < 6; j += 1) {
            if ((gridArray[i][j] != 0 && gridArray[i + 1][j] != 0 && gridArray[i + 2][j] != 0 && gridArray[i + 3][j] != 0) &&
            (gridArray[i][j] % 2 == 0 && gridArray[i + 1][j] % 2 == 0 && gridArray[i + 2][j] % 2 == 0 && gridArray[i + 3][j] % 2 == 0)) {
                document.getElementById("foregroundText").innerHTML='Player 2 has won!'
                return  1
            }
        }
    }
    for (let i = 0; i < 4; i += 1) {
        for(let j = 0; j < 6; j += 1) {
            if ((gridArray[i][j] != 0 && gridArray[i + 1][j] != 0 && gridArray[i + 2][j] != 0 && gridArray[i + 3][j] != 0) &&
            (gridArray[i][j] % 2 == 1 && gridArray[i + 1][j] % 2 == 1 && gridArray[i + 2][j] % 2 == 1 && gridArray[i + 3][j] % 2 == 1)) {
                document.getElementById("foregroundText").innerHTML='Player 1 has won!'
                return  1
            }
        }
    }


    //check diagonal down for player 2
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if ((gridArray[i][j] != 0 && gridArray[i + 1][j + 1] != 0 && gridArray[i + 2][j + 2] != 0 && gridArray[i + 3][j + 3] != 0) &&
            (gridArray[i][j] % 2 == 0 && gridArray[i + 1][j + 1] % 2 == 0 && gridArray[i + 2][j + 2] % 2 == 0 && gridArray[i + 3][j + 3] % 2 == 0)) {
                document.getElementById("foregroundText").innerHTML='Player 2 has won!'
                return  1;
            }
        }
    }
    //check diagonal down for player 1
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if ((gridArray[i][j] != 0 && gridArray[i + 1][j + 1] != 0 && gridArray[i + 2][j + 2] != 0 && gridArray[i + 3][j + 3] != 0) &&
            (gridArray[i][j] % 2 == 1 && gridArray[i + 1][j + 1] % 2 == 1 && gridArray[i + 2][j + 2] % 2 == 1 && gridArray[i + 3][j + 3] % 2 == 1)) {
                document.getElementById("foregroundText").innerHTML='Player 1 has won!'
                return  1;
            }
        }
    }


    //check diagonal up for player 2
    for (let i = 6; i > 2; i -= 1) {
        for (let j = 0; j < 3; j++) {
            if ((gridArray[i][j] != 0 && gridArray[i - 1][j + 1] != 0 && gridArray[i - 2][j + 2] != 0 && gridArray[i - 3][j + 3] != 0) &&
            (gridArray[i][j] % 2 == 0 && gridArray[i - 1][j + 1] % 2 == 0 && gridArray[i - 2][j + 2] % 2 == 0 && gridArray[i - 3][j + 3] % 2 == 0)) {
                document.getElementById("foregroundText").innerHTML='Player 2 has won!'
                return  1;
            }
        }
    }
    //check diagonal up for player 1
    for (let i = 6; i > 2; i -= 1) {
        for (let j = 0; j < 3; j++) {
            if ((gridArray[i][j] != 0 && gridArray[i - 1][j + 1] != 0 && gridArray[i - 2][j + 2] != 0 && gridArray[i - 3][j + 3] != 0) && 
            (gridArray[i][j] % 2 == 1 && gridArray[i - 1][j + 1] % 2 == 1 && gridArray[i - 2][j + 2] % 2 == 1 && gridArray[i - 3][j + 3] % 2 == 1)) {
                document.getElementById("foregroundText").innerHTML='Player 1 has won!'
                return  1;
            }
        }
    }
    let counter = 0
    for (let i = 0; i < 6; i += 1) {
        if (gridArray[0][i] == 0) {
            counter += 1
        }
    }
    if (counter == 0) {
        document.getElementById("foregroundText").innerHTML='Its a draw!'
        return 1
    }
    return 0
}

