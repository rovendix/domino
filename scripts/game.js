// global variables
let playerTurn = 1;
let gameStart = 0;
let draggedItem = null;
let checkDrop = false;
let pickPiece = null;
let GameBoard = {
  left: null,
  right: null,
  screenWidth: window.screen.availWidth - 320,
  currentHeight: window.screen.availHeight,
  leftPos: [50, 370],
  rightPos: [50, 538],
  leftWrap: 0,
  rightWrap: 0,
  pieceHeight: 84,
  pieceWidth: 36,
  add: function (piece, dest, pos) {
    // common state:
    if (pos === "right") {
      piece.style.top = `${this.rightPos[0]}px`;
      piece.style.left = `${this.rightPos[1]}px`;
      // update new position pf right piece:
      if (this.rightPos[1] + 200 < this.screenWidth) {
        this.rightPos[1] += this.pieceHeight;
      } else {
        if (this.rightWrap) {
          piece.style.transform = "rotateZ(0deg)";
          this.rightPos[0] += this.pieceHeight;
          this.rightWrap += 1;
        } else {
          this.rightPos[0] += 2 * this.pieceWidth - 10;
          this.rightPos[1] += this.pieceWidth - 10;
          this.rightWrap += 1;
        }
      }
      // check wether to rotate piece right or left:
      // ..........
      if (this.rightPos[0] >= this.currentHeight + this.pieceHeight) {
        this.currentHeight += this.pieceHeight;
        dest.style.height = `${this.currentHeight}px`;
      }
    } else {
      piece.style.top = `${this.leftPos[0]}px`;
      piece.style.left = `${this.leftPos[1]}px`;
      if (this.leftPos[1] - 200 > 0) {
        this.leftPos[1] -= this.pieceHeight;
      } else {
        if (this.leftWrap) {
          piece.style.transform = "rotateZ(0deg)";
          this.leftPos[0] += this.pieceHeight;
          this.leftWrap += 1;
        } else {
          this.leftPos[0] += 2 * this.pieceWidth - 10;
          this.leftPos[1] -= this.pieceWidth - 10;
          this.leftWrap += 1;
        }
      }

      if (this.leftPos[0] >= this.currentHeight + this.pieceHeight) {
        this.currentHeight += this.pieceHeight;
        dest.style.height = `${this.currentHeight}px`;
      }
    }
    dest.appendChild(piece);
  },
  reset: function () {
    this.left = null;
    this.right = null;
    this.screenWidth = window.screen.availWidth - 320;
    this.currentHeight = window.screen.availHeight;
    this.leftPos = [50, 370];
    this.rightPos = [50, 538];
    this.leftWrap = 0;
    this.rightWrap = 0;
    this.pieceHeight = 84;
    this.pieceWidth = 36;
  },
};
function createEmptyPiece(pos, top = 0, left = 0) {
  let piece = document.createElement("div");
  piece.classList.add("empty-piece");
  piece.classList.add(pos);
  piece.style.top = `${top}px`;
  piece.style.left = `${left}px`;
  piece.style.transform = "rotateZ(90deg)";
  return piece;
}
function createPiece(up, down) {
  let upDots = `<div class="dot"></div>`.repeat(up);
  let downDots = `<div class="dot"></div>`.repeat(down);
  let pieceHtml = `
    <div class="back-face"></div>
    <div class="front-face">
      <div class="up">${upDots}</div>
      <span class="separator"></span>
      <div class="down">${downDots}</div>
    </div>
    `;
  let pieceElement = document.createElement("div");
  pieceElement.innerHTML = pieceHtml;
  pieceElement.classList.add("piece");
  pieceElement.id = `p${up}${down}`;
  pieceElement.children[1].children[0].classList.add(`p${up}`);
  pieceElement.children[1].children[2].classList.add(`p${down}`);
  return pieceElement;
}
function mainMenu() {
  let startButton = document.getElementsByClassName("new-game")[0];
  startButton.onclick = () => {
    let mainGame = document.getElementsByClassName("main-game")[0];
    let mainMenu = document.getElementsByClassName("main-menu")[0];
    mainMenu.style.display = "none";
    mainGame.style.display = "grid";
  };
  let exitButton = document.getElementsByClassName("exit")[0];
  exitButton.onclick = () => {
    window.location.href = "";
  };
}
function createRandomPieces() {
  let randomPieces = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      randomPieces.push(createPiece(i, j));
    }
  }
  let len = randomPieces.length;
  for (let i = 0; i < len; i++) {
    randNum = Math.floor(Math.random() * randomPieces.length);
    let temp = randomPieces[i];
    randomPieces[i] = randomPieces[randNum];
    randomPieces[randNum] = temp;
  }
  let selectionBoard = document.querySelector(".selection-board");
  randomPieces.forEach((ele) => {
    selectionBoard.appendChild(ele);
  });
}
function addDragPiece(ele) {
  ele.ondragstart = function eventHandler(event) {
    if (event.target.hasAttribute("draggable")) {
      draggedItem = event.target;
      draggedItem.style.opacity = "0.85";
    }
  };
  ele.ondragend = function eventHandler(event) {
    if (event.target.hasAttribute("draggable")) {
      draggedItem.style.opacity = "1";
      console.log("drag end");
      if (checkDrop) {
        draggedItem.removeAttribute("draggable");
        draggedItem.removeEventListener("drop", eventHandler);
        draggedItem.removeEventListener("dragover", eventHandler);
        draggedItem.removeEventListener("dragstart", eventHandler);
        draggedItem.removeEventListener("dragend", eventHandler);

        let emptyPieces = document.querySelectorAll(".empty-piece");
        emptyPieces.forEach((ele) => {
          addDragEffect(ele);
          // drop piece:
          addDrop(ele);
        });
        checkDrop = false;
        checkWin(playerTurn);
        playerTurn == 1 ? (playerTurn = 2) : (playerTurn = 1);
        setPlayerTurn("player" + playerTurn);
      }
      draggedItem = null;
    }
  };
}
function setPlayerTurn(player) {
  let allPieces = document.querySelectorAll(".piece");
  pickPiece = 1;
  allPieces.forEach((ele) => {
    if (ele.parentNode.id === player) {
      if (
        ele.id.charAt(1) == GameBoard.left ||
        ele.id.charAt(1) == GameBoard.right ||
        ele.id.charAt(2) == GameBoard.left ||
        ele.id.charAt(2) == GameBoard.right ||
        GameBoard.left == null
      ) {
        ele.style.cursor = "grab";
        ele.setAttribute("draggable", "true");
        ele.parentNode.children[0].style.color = "#00b050";
        addDragPiece(ele);
        pickPiece = 0;
      }
    } else {
      if (ele.parentNode.classList.contains("rest-pieces")) {
        ele.style.cursor = "pointer";
      } else {
        ele.style.cursor = "default";
      }
      ele.removeAttribute("draggable");
      ele.parentNode.children[0].style.color = "#fff";
    }
  });
}
function addDragEffect(ele) {
  ele.ondragover = function eventHandler(event) {
    event.preventDefault();
    ele.style.borderColor = "#00b050";
  };
  ele.ondragleave = function eventHandler(event) {
    ele.style.borderColor = "red";
  };
}

function addDrop(ele) {
  ele.ondrop = function eventHandler(event) {
    console.log("drop");
    let currentBoard = document.getElementsByClassName("game-board")[0];
    let upVal = draggedItem.id.charAt(1);
    let downVal = draggedItem.id.charAt(2);
    // check whether it's first move or not:
    if (GameBoard.left === null) {
      // first move:
      checkDrop = "first";
    } else {
      // common move
      // check whether the player want to mpve piece to right or left:
      if (ele.classList.contains("right")) {
        // player wants to move piece right
        // check whether dragged piece contains any wanted number
        if (GameBoard.right == upVal) {
          // add rotate here
          GameBoard.right = downVal;
          checkDrop = "r";
          if (GameBoard.rightWrap > 1) {
            draggedItem.style.transform = "rotateZ(0deg)";
          } else {
            draggedItem.style.transform = "rotateZ(270deg)";
          }
        } else if (GameBoard.right == downVal) {
          // add rotate here
          GameBoard.right = upVal;
          checkDrop = "r";
          if (GameBoard.rightWrap > 1) {
            draggedItem.style.transform = "rotateZ(180deg)";
          }
        }
      } else {
        // player wants to move piece left:
        // check whether dragged piece contains any wanted number
        if (GameBoard.left == upVal) {
          // add rotate here
          GameBoard.left = downVal;
          checkDrop = "l";
          if (GameBoard.leftWrap > 1) {
            draggedItem.style.transform = "rotateZ(0deg)";
          }
        } else if (GameBoard.left == downVal) {
          // add rotate here
          GameBoard.left = upVal;
          checkDrop = "l";
          if (GameBoard.leftWrap > 1) {
            draggedItem.style.transform = "rotateZ(180deg)";
          } else {
            draggedItem.style.transform = "rotateZ(270deg)";
          }
        }
      }
    }
    // check whether drop happened or not:
    if (checkDrop) {
      currentBoard.append(draggedItem);
      draggedItem.style.top = ele.style.top;
      draggedItem.style.left = ele.style.left;
      draggedItem.style.position = "absolute";
      draggedItem.style.cursor = "default";
      ele.remove();
      if (checkDrop == "r") {
        GameBoard.add(createEmptyPiece("right"), currentBoard, "right");
      } else if (checkDrop == "l") {
        GameBoard.add(createEmptyPiece("left"), currentBoard, "left");
      } else {
        GameBoard.add(createEmptyPiece("right"), currentBoard, "right");
        GameBoard.add(createEmptyPiece("left"), currentBoard, "left");
        GameBoard.right = upVal;
        GameBoard.left = downVal;
        draggedItem.style.top = "50px";
        draggedItem.style.left = "454px";
      }
    } else {
      event.preventDefault();
    }
  };
}
function checkWin(player) {
  let playerDiv = document.getElementById("player" + player);
  if (playerDiv.children.length <= 1) {
    // remove all pieces:
    let pieces = document.querySelectorAll(".piece");
    pieces.forEach((ele) => {
      ele.remove();
    });
    // switch boards:
    let currentBoard = document.getElementsByClassName("game-board")[0];
    currentBoard.style.display = "none";
    currentBoard.innerHTML = `<div class="empty-piece">`;
    currentBoard.style.height = "110vh";
    let selectionBoard = document.getElementsByClassName("selection-board")[0];
    selectionBoard.style.display = "flex";
    // create game over screen:
    let gameOver = document.createElement("div");
    gameOver.innerHTML = `
    <h1>Player ${player} won!</h1>
    <button id="continue-btn">Continue playing</button>
    <button id="exit-btn">Exit Game</button>
    `;
    gameOver.id = "game-over";
    selectionBoard.appendChild(gameOver);
    let continueBtn = document.getElementById("continue-btn");
    let exitBtn = document.getElementById("exit-btn");
    continueBtn.onclick = function () {
      gameOver.remove();
      createRandomPieces();
      GameBoard.reset();
      pickPiece = null;
      gameStart = 0;
      playerTurn = 2;
    };
  }
}

function startGame() {
  document.body.onclick = function (event) {
    let element = event.target;
    if (element.classList.contains("back-face")) {
      // move piece to player area:
      if (gameStart === 0) {
        let parent = element.parentElement;
        parent.style.transform = "rotateY(0deg)"; // flip paper
        if (playerTurn === 1) {
          playerTurn = 2;
          let player1 = document.getElementById("player1");
          setTimeout(function () {
            parent.style.transform += " rotateZ(90deg)";
            player1.appendChild(parent);
          }, 1000);
        } else {
          playerTurn = 1;
          let player2 = document.getElementById("player2");
          setTimeout(function () {
            parent.style.transform += " rotateZ(90deg)";
            player2.appendChild(parent);
          }, 1000);

          // moving rest pieces:
          if (player2.childElementCount >= 7) {
            oldNodes = document.querySelector(".selection-board .piece");
            newPlace = document.getElementsByClassName("rest-pieces")[0];
            while (document.querySelector(".selection-board .piece")) {
              newPlace.appendChild(
                document.querySelector(".selection-board .piece")
              );
            }
            gameStart = 1;
            let board = document.getElementsByClassName("board")[0];
            board.children[0].style.display = "none";
            board.children[1].style.display = "block";
            board.children[1].style.height = "110vh";

            // remove pointer cursor from all pieces and add grap cursor to first player pieces
            setTimeout(() => {
              setPlayerTurn("player1");
            }, 1000);

            // add dragover effects:
            let emptyPieces = document.querySelectorAll(".empty-piece");
            emptyPieces.forEach((ele) => {
              addDragEffect(ele);
              // drop piece:
              addDrop(ele);
            });
          }
        }
      }
      if (pickPiece == 1) {
        console.log("hello");
        let selectedPiece = element.parentElement;
        let playerDiv = document.getElementById("player" + playerTurn);
        selectedPiece.style.transform = "rotateY(0deg)"; // flip paper
        setTimeout(function () {
          selectedPiece.style.transform += " rotateZ(90deg)";
          playerDiv.appendChild(selectedPiece);
        }, 1000);
        if (
          selectedPiece.id.charAt(1) == GameBoard.left ||
          selectedPiece.id.charAt(1) == GameBoard.right ||
          selectedPiece.id.charAt(2) == GameBoard.left ||
          selectedPiece.id.charAt(2) == GameBoard.right
        ) {
          selectedPiece.setAttribute("draggable", "true");
          selectedPiece.style.cursor = "grab";
          addDragPiece(selectedPiece);
          pickPiece = 0;
        }
      }
    }
  };
}
mainMenu();
createRandomPieces();
startGame();

// game start:

// on drag:
