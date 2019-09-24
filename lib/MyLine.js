import MyPoint from './MyPoint'

class MyLine {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.a = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x)
    this.b = endPoint.y - (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x) * endPoint.x
    this.long = Math.sqrt(Math.pow(endPoint.y - startPoint.y, 2) + Math.pow(endPoint.x - startPoint.x, 2))
  }

  getSin(){
    return (this.endPoint.y - this.startPoint.y) / this.long
  }
  
  getCos(){
    return (this.endPoint.x - this.startPoint.x) / this.long
  }
}

export { MyLine }