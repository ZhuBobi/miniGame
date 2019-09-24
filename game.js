import {MyLine} from './lib/MyLine';
import {MyPoint} from './lib/MyPoint';

const canvas = wx.createCanvas()

const context = canvas.getContext('2d') // 创建一个 2d context
const { windowWidth, windowHeight } = wx.getSystemInfoSync()

// const image = wx.createImage()
let imgY = 0
context.fillStyle = '#ffffff'
context.fillRect(0, 0, windowWidth, windowHeight)

context.fillStyle = '#f0f0f0'
context.fillRect(25, 50, windowWidth-40, windowHeight-100)

// image.src = 'jianxiao1.png'


// function drawRect(x, y) {
//   context.clearRect(0, 0, windowWidth, windowHeight)
//   context.fillStyle = '#ffffff'
//   context.fillRect(0, 0, windowWidth, windowHeight)
//   context.drawImage(image, x, y)
// }

var leftTop = new MyPoint(25,50)
var rightTop = new MyPoint(windowWidth - 15, 50)
var rightBottom = new MyPoint(windowWidth - 15, windowHeight - 50)
var leftBottom = new MyPoint(25, windowHeight - 50)

// myDrawLine.drawRect(start,mid1,mid2,end)

function drawRect() {
  context.strokeStyle = "red";
  context.lineWidth = 1.5
  context.moveTo(arguments[0].x, arguments[0].y);
  for (let i = 1; i < arguments.length; i++) {
    context.lineTo(arguments[i].x, arguments[i].y);
  }
  context.lineTo(arguments[0].x, arguments[0].y);
  context.stroke()
}


// let rectX = 0
// let rectY = 0
// let down = true
// let right = true

// setInterval(function () {
//   if(rectY + 150 == canvas.height){
//     down = false
//   }
//   if (rectY == 0){
//     down = true
//   }
//   if(rectX + 150 == canvas.width){
//     right = false
//   }
//   if (rectX == 0){
//     right = true
//   }
//   drawRect(right ? rectX++ : rectX--, down ? rectY++ : rectY--)
// }, 16)

let t = {}
let t1 = {}
wx.onTouchStart(function (e) {
  t.x = e.changedTouches[0].clientX
  t.y = e.changedTouches[0].clientY
  t.startId = e.changedTouches[0].identifier
})

// wx.onTouchEnd(function(e){
//   t1.x = e.changedTouches[0].clientX
//   t1.y = e.changedTouches[0].clientY
//   t1.startId = e.changedTouches[0].identifier
//   console.log(e.changedTouches)
//   console.log('触摸终点，x:' + t1.x + ',y:' + t1.y)
//   context.strokeStyle = "red";
//   context.moveTo(t.x, t.y);//垂直方向画15根线，相距30px;
//   context.lineTo(t1.x, t1.y);

//   context.stroke();
// })

let speed = 125
let timeSpace = 16 

wx.onTouchMove(function (e) {

  canvas.width = canvas.width
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, windowWidth, windowHeight)

  context.fillStyle = '#f0f0f0'
  context.fillRect(25, 50, windowWidth - 40, windowHeight - 100)

  drawRect(leftTop, rightTop, rightBottom, leftBottom)
  t1.x = e.changedTouches[0].clientX
  t1.y = e.changedTouches[0].clientY
  var points = getKeyPoints(t, t1)
  drawRect(points[0], points[1])
})

wx.onTouchEnd(function(e){
  
  canvas.width = canvas.width
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, windowWidth, windowHeight)

  context.fillStyle = '#f0f0f0'
  context.fillRect(25, 50, windowWidth - 40, windowHeight - 100)

  drawRect(leftTop, rightTop, rightBottom, leftBottom)
  t1.x = e.changedTouches[0].clientX
  t1.y = e.changedTouches[0].clientY
  var points = getKeyPoints(t, t1)
  drawLineSlow(points[0], points[1])
})

function drawLineSlow(startPoint,endPoint){
  let lastLine = new MyLine(startPoint, endPoint)
  let point = new MyPoint(startPoint.x, startPoint.y)
  let addX = speed * lastLine.getCos() / 100
  let addY = speed * lastLine.getSin() / 100
  setInterval(function (){
    point.x += addX
    point.y += addY
    if ((addX > 0 && endPoint.x >= point.x) || (addX < 0 && endPoint.x <= point.x)){
      drawRect(startPoint, point)
    }else{
      return
    }
    }, timeSpace)
}

function getKeyPoints (startPoint,endPoint){
  var result = []
  let line = new MyLine(startPoint,endPoint)
  if (line.a == Infinity){
    result[0] = new MyPoint(startPoint.x, rightBottom.y)
    result[1] = new MyPoint(startPoint.x,rightTop.y)
  }else if(line.a == 0){
    result[0] = new MyPoint(rightTop.x, startPoint.y)
    result[1] = new MyPoint(leftTop.x, startPoint.y)
  }else{
    result = filterPoints(getPoints(startPoint, endPoint),startPoint,endPoint)
  }
  return result
}

function filterPoints(points, startPoint, endPoint){
  let inOnPoints=[]
  let ind = 0
  for(var index in points){
    if (points[index].x >= leftTop.x && points[index].x <= rightBottom.x && points[index].y >= leftTop.y && points[index].y <= leftBottom.y){
      inOnPoints[ind] = points[index]
      ind++
    }
  }
  let result = []
  let sPoint = inOnPoints[0]
  let ePoint = inOnPoints[1]
  let judge = endPoint.x > startPoint.x
  if (judge){
    if (sPoint.x > ePoint.x) {
      result[0] = ePoint
      result[1] = sPoint
    }else{
      result[0] = sPoint
      result[1] = ePoint
    }
  }else{
    if (sPoint.x > ePoint.x) {
      result[0] = sPoint
      result[1] = ePoint
    } else {
      result[0] = ePoint
      result[1] = sPoint
    }
  }
  return result
}


let points = [leftTop, rightTop, rightBottom, leftBottom]

function getPoints(startPoint,endPoint){
  let drawLine = new MyLine(startPoint, endPoint)
  let commonPoints = []
  for (let i = 0; i < points.length;i++){
    if (i == points.length-1){
      commonPoints[i] = calculatePoint(drawLine, new MyLine(points[i], points[0]))
    }else{
      commonPoints[i] = calculatePoint(drawLine, new MyLine(points[i], points[1 + i]))
    }
  }
  return commonPoints
}

function calculatePoint(aLine,bLine){
  if(aLine.a == bLine.a){//a,b平行
    return null
  }else if (aLine.a == 0){//a平行于x轴
    return new MyPoint((aLine.b-bLine.b)/bLine.a, aLine.b)
  } else if (bLine.a == 0) {//b平行于x轴
    return new MyPoint((bLine.b - aLine.b) / aLine.a, bLine.b)
  } else if (aLine.a == Infinity || aLine.a == -Infinity) {//a垂直于x轴
    return new MyPoint(aLine.startPoint.x, bLine.a * aLine.startPoint.x + bLine.b)
  } else if (bLine.a == Infinity || bLine.a == -Infinity) {//b垂直于x轴
    return new MyPoint(bLine.startPoint.x, aLine.a * bLine.startPoint.x + aLine.b)
  }else{//其他情况
    let x = (bLine.b - aLine.b) / (bLine.a - aLine.a)
    let y = aLine.a * x + aLine.b
    return new MyPoint(x, y)
  }
}