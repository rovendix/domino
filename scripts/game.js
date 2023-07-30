// global variables
playerTurn = 1;
gameStart = 0;

function createPiece(up, down) {
  let upDots = `<div class="dot"></div>`.repeat(up);
  let downDots = `<div class="dot"></div>`.repeat(down);
  let pieceHtml = `
    <div class="front-face">
      <div class="up">${upDots}</div>
      <span class="separator"></span>
      <div class="down">${downDots}</div>
    </div>
    <div class="back-face"></div>
    `;
  let pieceElement = document.createElement("div");
  pieceElement.innerHTML = pieceHtml;
  pieceElement.classList.add("piece");
  pieceElement.id = `p${up}${down}`;
  pieceElement.children[0].children[0].classList.add(`p${up}`);
  pieceElement.children[0].children[2].classList.add(`p${down}`);
  return pieceElement;
}
// main menu:
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
  console.log("hey");
};
// create start pieces:
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
  let board = document.querySelector(".board");
  randomPieces.forEach((ele) => {
    board.appendChild(ele);
  });
}
createRandomPieces();

// start game simulation
document.body.onclick = function (event) {
  let element = event.target;
  console.log(element);
  if (element.classList.contains("back-face")) {
    // move piece to player area:
    if (gameStart === 0) {
      let parent = element.parentElement;
      parent.style.transform = "rotateY(180deg)";
      if (playerTurn === 1) {
        playerTurn = 2;
        let player1 = document.getElementById("player1");
        setTimeout(function () {
          parent.style.transform =
            "rotateY(180deg) rotateZ(90deg) translateY(45px)";
          player1.appendChild(parent);
        }, 1000);
      } else {
        playerTurn = 1;
        let player2 = document.getElementById("player2");
        setTimeout(function () {
          parent.style.transform =
            "rotateY(180deg) rotateZ(90deg) translateY(45px)";
          player2.appendChild(parent);
        }, 1000);

        // moving rest pieces:
        if (player2.childElementCount >= 8) {
          oldNodes = document.querySelector(".board .piece");
          newPlace = document.getElementsByClassName("rest-pieces")[0];
          while (document.querySelector(".board .piece")) {
            newPlace.appendChild(document.querySelector(".board .piece"));
          }

          gameStart = 1;
        }
      }
    }
  } else if (element.parentElement.classList.contains("front-face")) {
    let pieceElement = element.parentElement.parentElement;
    let draggable = document.createAttribute("draggable");
    pieceElement.setAttributeNode(draggable);
    if (gameStart === 1) {
      console.log("1");
      let board = document.getElementsByClassName("board")[0];
      let player1Pieces = document.querySelectorAll("#player1 .piece");
      let player2Pieces = document.querySelectorAll("#player2 .piece");
      if (board.childNodes.length === 0) {
        console.log("2");
        player1Pieces.forEach((ele) => {
          if (pieceElement === ele) {
            console.log("3");

            board.appendChild(pieceElement);
          }
        });
      }
    }
  }
};
