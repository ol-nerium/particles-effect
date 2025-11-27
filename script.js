// setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("ctx", ctx);

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); // x0 y0 x1 y1
gradient.addColorStop(0, "white");
gradient.addColorStop(0.5, "magenta");
gradient.addColorStop(1, "blue");

ctx.fillStyle = gradient;

// ctx.strokeStyle = "white";
// ctx.lineWidth = 5;
// ctx.fillRect(50, 50, 20, 100); //x, y, w, h

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.random() * 10 + 5;
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - 2 * this.radius);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
  }
  draw(context) {
    // context.fillStyle = `hsl(${this.x * 0.5}, 100%, 50%)`;
    // hue saturation lightness

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  update() {
    this.x += this.vx;
    if (this.x > this.effect.width - this.radius || this.x < this.radius)
      this.vx *= -1;

    this.y += this.vy;
    if (this.y > this.effect.height - this.radius || this.y < this.radius)
      this.vy *= -1;
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 52;
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i += 1) {
      this.particles.push(new Particle(this));
    }
  }

  handleParticles(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
}

const effect = new Effect(canvas);
effect.handleParticles(ctx);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  requestAnimationFrame(animate);
}
animate();
