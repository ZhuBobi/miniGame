class MyPoint{
  x
  y
  constructor(x=0,y=0){
    this.x = Math.floor(x)
    this.y = Math.floor(y)
  }
  toString(){
    console.log("{x:" + this.x + "，y:" + this.y + "}")
  }
}

export { MyPoint }