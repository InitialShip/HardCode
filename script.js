var canvas = document.getElementById('canvas')
var c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66',"#15AFD6","#66E0FF","#00FFA6","#FF4840","#CC1455"]

addEventListener('resize', ()=>{
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})


class Particle {
  constructor (x,y,radius,color)
  {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }
  draw(){
    c.beginPath()
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }
  update(){
    this.draw()
  }
}

let Particles
function init() {
  Particles = []
  for (let i = 0; i < 1000; i++)
  {
    const canvasWidth = canvas.width + 400
    const canvasHeight = canvas.height + 800
    const x = Math.random() * canvasWidth - canvasWidth/2
    const y = Math.random() * canvasHeight - canvasHeight/2
    const radius = Math.random() * 4
    const color = colors[parseInt(Math.random() * colors.length-1)]
    Particles.push(new Particle(x,y,radius,color))
  }
  /* console.log(Particles) */
}
let radians = 0
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle='rgba(10,10,10,0.2)'
  c.fillRect(0,0,canvas.width,canvas.height)
  
  c.save()
  c.translate(canvas.width/2,canvas.height/2)
  c.rotate(radians)
  Particles.forEach(Particle => {
    Particle.update()
  })
  c.restore()
  radians+= 0.001
}

init()
animate()