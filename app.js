// 選定 id 為 myCanvas 的element 附值給 canvas
const canvas = document.getElementById("myCanvas");
//使用 getContext("2d" / "3d") method獲得 2d 或 3d的畫布空間
const ctx = canvas.getContext("2d");
//設定 canvas 畫布內單位
const unit = 20; //畫布中每單位為20px
const row = canvas.height / unit; //row數量 = 400/20 = 20
const column = canvas.width / unit; //column數量= 400/20 = 20

//蛇的座標
//array 中的每一個element都是一個object。
//object功能為儲存蛇身的 x,y 座標
let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 製作果實物件
class Fruits {
  //製作出果實物件後，即給定一個隨機的x, y 座標
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit; // 0 - 380
    this.y = Math.floor(Math.random() * row) * unit; // 0 - 380
  }
  // 畫出果實的function
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  // 選新的生成果實 x, y 座標
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;
    //檢查果實新座標有沒有和蛇身重疊
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

let myFruit = new Fruits();

//畫出蛇身體 +果實等
function draw() {
  //每次畫圖之前，確認蛇有沒有咬到自己。
  for (let j = 1; j < snake.length; j++) {
    if (snake[0].x == snake[j].x && snake[0].y == snake[j].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }
  //將canvas畫布背景設定為全黑，每次執行即覆蓋舊畫，不然canvas會在就有個圖上一直畫下去
  ctx.fillStyle = "black";
  //fillRect method 為填滿矩形
  //parameter 是 fillRect(x座標,y座標,矩形寬度, 矩形高度)
  //劃出一個左上座標為 (0,0) canvas 寬高同等的矩形 (黑色)
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //畫出果實
  myFruit.drawFruit();

  //畫出蛇
  //對snake array跑迴圈，依照snake長度決定劃出身體量
  for (i = 0; i < snake.length; i++) {
    //如果 i = 0，蛇頭顏色為亮綠色
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      //蛇身顏色為亮藍色
      ctx.fillStyle = "lightblue";
    }
    //蛇外框線顏色為白色
    ctx.strokeStyle = "white";

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //製作蛇的方塊，在蛇座標 (x,y)向右畫出寬高為unit的矩形(填滿)
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); //製作蛇的方塊的border，在蛇座標 (x,y)向右畫出寬高為unit的矩形(border)
  }
  //按照目前方向決定蛇移動的下一偵要放在哪一個座標
  // 獲得當下蛇頭座標 snakeX與 snakeY
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Right") {
    snakeX += unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  } else if (d == "Left") {
    snakeX -= unit;
  }
  // 判斷新蛇頭是否超出牆
  if (snakeX == canvas.width) {
    snakeX = 0;
  }
  if (snakeX == -unit) {
    snakeX = canvas.width - unit;
  }
  if (snakeY == canvas.height) {
    snakeY = 0;
  }
  if (snakeY < -unit) {
    snakeY = canvas.height - unit;
  }
  //創造新蛇頭
  let newSnakeHead = {
    x: snakeX,
    y: snakeY,
  };
  //在snake array 中加入新蛇頭與刪除蛇尾
  //判斷蛇有沒有吃到果實，吃到的話需要做以下3件事：
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    // 1.重新生成果實隨機位置   //2. 製作新果實 (下次draw 會畫故這可省略)
    myFruit.pickALocation();
    //3.更新分數
    score++;
    document.getElementById("score").innerHTML = "遊戲分數:" + " " + score;
    //若分數大於最高分數則要更新最高分數
    setHighestScore(score);
    document.getElementById("highestScore").innerHTML =
      "最高分數:" + " " + highestScore;
  } else {
    //沒吃到則刪除蛇尾
    snake.pop();
  }

  //在snake array中新增蛇頭
  snake.unshift(newSnakeHead);

  //在window新增事件監聽，當鍵盤有keydown時，執行changDirection 這個function
  window.addEventListener("keydown", changDirection);
}
//更改方向的function
function changDirection(e) {
  if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  }
  // 若輸入方向鍵太快，可能出現下一偵繪製但系統已改變數值情況，進而導致不尋常自殺情況
  // 例如現在方向是 向右(不可向左)，但快速輸入上左，即會會改變方向為向左，即自己咬自己。
  // 可設定在方向改變後，直到下一偵蛇身畫出前，無法再接受 keydown事件，以防止連續按鍵。
  window.removeEventListener("keydown", changDirection);
}
//載入瀏覽器中的最高分
//去 localStorage找有沒有highestScore，沒有的話則給值 0 ，有的話則套用
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

//更新瀏覽器中的最高分，若score > 最高分，將內存最高分設定為score ，且將 hightestScore = score
function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
//遊戲初始設定：
//執行創造蛇function
createSnake();

// 默認行徑方向為 Right
let d = "Right";
//設定分數
let score = 0;
let highestScore;

loadHighestScore();
document.getElementById("score").innerHTML = "遊戲分數:" + " " + score;
document.getElementById("highestScore").innerHTML =
  "最高分數:" + " " + highestScore;
//執行創造繪畫function
let myGame = setInterval(draw, 100);
