const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");

const cellSize = 50;
const rows = 10;
const cols = 12;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let maze = [
  [0,0,0,0,0,0,1,0,0,0,0,2],
  [1,1,0,1,1,0,1,0,1,1,0,1],
  [0,0,0,0,1,0,0,0,0,1,0,0],
  [0,1,1,0,1,1,1,1,0,1,1,0],
  [0,0,0,0,0,4,0,0,0,0,0,0],
  [1,0,1,1,1,1,1,1,1,1,0,1],
  [0,0,0,0,0,0,0,0,0,4,0,0],
  [0,1,1,1,1,0,1,1,1,1,1,0],
  [0,0,4,0,0,0,0,0,4,0,0,0],
  [3,1,1,1,1,1,1,1,1,1,1,0]
];

let groomPos = { x: 0, y: 9 };
let bridePos = { x: 11, y: 0 };

const groomImg = new Image();
const brideImg = new Image();
const heartImg = new Image();

groomImg.src = "groom.png";
brideImg.src = "bride.png";
heartImg.src = "heart.png";

let totalHearts = 0;
maze.forEach(row => row.forEach(cell => { if(cell===4) totalHearts++; }));
let collectedHearts = 0;
let firstMoveHint = true;

function getFirstHintCell() {
    const dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];
    for(let d of dirs){
        const nx = groomPos.x+d.x;
        const ny = groomPos.y+d.y;
        if(nx>=0 && nx<cols && ny>=0 && ny<rows && maze[ny][nx]===0) return {x:nx,y:ny};
    }
    return null;
}
const hintCell = getFirstHintCell();

function drawMaze(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
            ctx.fillStyle = maze[y][x]===1 ? "#333" : "#f9f9f9";
            ctx.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
            ctx.strokeStyle="#ccc";
            ctx.strokeRect(x*cellSize,y*cellSize,cellSize,cellSize);
            if(maze[y][x]===4){
                ctx.drawImage(heartImg,x*cellSize+10,y*cellSize+10,30,30);
            }
            if(firstMoveHint && hintCell && x===hintCell.x && y===hintCell.y){
                ctx.fillStyle="rgba(245, 222, 179, 0.6)";
                ctx.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
            }
        }
    }
    ctx.drawImage(groomImg,groomPos.x*cellSize+8,groomPos.y*cellSize+8,35,35);
    ctx.drawImage(brideImg,bridePos.x*cellSize+8,bridePos.y*cellSize+8,35,35);
}

let imagesLoaded=0;
function checkLoaded(){imagesLoaded++; if(imagesLoaded===3) drawMaze();}
groomImg.onload=checkLoaded;
brideImg.onload=checkLoaded;
heartImg.onload=checkLoaded;

canvas.addEventListener("click",(e)=>{
    const rect=canvas.getBoundingClientRect();
    const clickX=Math.floor((e.clientX-rect.left)/cellSize);
    const clickY=Math.floor((e.clientY-rect.top)/cellSize);
    const dx=clickX-groomPos.x;
    const dy=clickY-groomPos.y;
    if(Math.abs(dx)+Math.abs(dy)!==1) return;
    if(maze[clickY][clickX]===1) return;
    groomPos.x=clickX; groomPos.y=clickY;
    if(firstMoveHint) firstMoveHint=false;
    if(maze[clickY][clickX]===4){collectedHearts++; maze[clickY][clickX]=0;}
    drawMaze();
    if(groomPos.x===bridePos.x && groomPos.y===bridePos.y){
        if(collectedHearts===totalHearts){
            setTimeout(()=>{alert("Поздравляем! Жених добрался до невесты и собрал все сердечки!"); window.location.href="address.html";},100);
        } else {alert(`Нужно собрать все сердечки! Собрано: ${collectedHearts}/${totalHearts}`);}
    }
});
