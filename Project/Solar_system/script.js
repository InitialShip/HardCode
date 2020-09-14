
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight


const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
function Planet (x, y, radius, color,velocity,distant){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.radians = parseInt(Math.random() * 360)
    this.velocity = velocity
    this.distant = distant
  this.draw = ()=> {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  this.update = () => {
    this.radians += this.velocity
    this.x = x + Math.cos(this.radians) * distant
    this.y = y + Math.sin(this.radians) * distant
    this.draw()
  }
}

// Implementation
let Planets
function init() {
  Planets = []
  var EarthSpeed = 0.001
  var Sun = new Planet (canvas.width/2,canvas.height/2,50,'yellow',0,0)
  Planets.push(Sun)
  var Mercury = new Planet (canvas.width/2,canvas.height/2,5,'grey',EarthSpeed/0.2,70)
  Planets.push(Mercury)
  var Venus = new Planet (canvas.width/2,canvas.height/2,7,'pale',EarthSpeed/0.6,90)
  Planets.push(Venus)
  var Earth = new Planet (canvas.width/2,canvas.height/2,10,'green',EarthSpeed,150)
  Planets.push(Earth)
  var Mars = new Planet (canvas.width/2,canvas.height/2,9,'orange',EarthSpeed/1.9,200)
  Planets.push(Mars)
  var Jupiter = new Planet (canvas.width/2,canvas.height/2,30,'#FA9632',EarthSpeed/11.9,300)
  Planets.push(Jupiter)
  var Saturn = new Planet (canvas.width/2,canvas.height/2,40,'#FA9632',EarthSpeed/29.5,400)
  Planets.push(Saturn)
  var Uranus = new Planet (canvas.width/2,canvas.height/2,10,'#326496',EarthSpeed/84,500)
  Planets.push(Uranus)
  var Neptune = new Planet (canvas.width/2,canvas.height/2,20,'#003296',EarthSpeed/164.8,600)
  Planets.push(Neptune)
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle='rgba(0,0,0,0.1)'
  c.fillRect(0,0,canvas.width,canvas.height)
  /* c.clearRect(0, 0, canvas.width, canvas.height) */

   Planets.forEach(Planet => {
    Planet.update()
   })
}

init()
animate()