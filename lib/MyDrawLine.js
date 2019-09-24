

const drawRect = function () {
  canvas = wx.createCanvas()

  context = canvas.getContext('2d') // 创建一个 2d context
  var { windowWidth, windowHeight } = wx.getSystemInfoSync()
  context.strokeStyle = "red";
  context.lineWidth = 1.5
  context.moveTo(arguments[0].x, arguments[0].y);
  for (let i = 1; i < arguments.length;i++){
    context.lineTo(arguments[i].x, arguments[i].y);
  }
  context.lineTo(arguments[0].x, arguments[0].y);
  context.stroke()
}

export { drawRect }