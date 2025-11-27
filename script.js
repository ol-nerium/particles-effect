// setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); // x0 y0 x1 y1
gradient.addColorStop(0, "pink");
gradient.addColorStop(0.5, "red");
gradient.addColorStop(1, "magenta");

ctx.fillStyle = gradient;
// ctx.strokeStyle = gradient;

class Particle {
  constructor(effect, index) {
    this.index = index;
    this.effect = effect;
    this.radius = Math.floor(Math.random() * 8 + 8);
    this.minRadius = this.radius;
    this.maxRadius = this.radius * 5;
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - 2 * this.radius);
    this.vx = Math.random() * 0.2 - 0.1;
    this.vy = Math.random() * 0.2 - 0.1;

    // this.pushX = 0;
    // this.pushY = 0;
    // this.friction = 0.8;
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.save();
    context.fillStyle = "white";
    context.beginPath();
    context.arc(
      this.x - this.radius * 0.2,
      this.y - this.radius * 0.3,
      this.radius * 0.6,
      0,
      Math.PI * 2
    );
    context.fill();
    context.restore();
  }

  update() {
    if (this.effect.mouse.pressed) {
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const distance = Math.hypot(dx, dy);
      const force = this.effect.mouse.radius / distance;
      if (distance < this.effect.mouse.radius && this.radius < this.maxRadius) {
        this.radius += 2;
      }
    }

    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx *= -1;
    }
    if (this.x > this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius;
      this.vx *= -1;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy *= -1;
    }
    if (this.y > this.effect.height - this.radius) {
      this.y = this.effect.height - this.radius;
      this.vy *= -1;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  reset() {
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - 2 * this.radius);
  }
}

class Effect {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 220;
    this.createParticles();

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      pressed: false,
      radius: 120,
    };
    window.addEventListener("resize", (e) => {
      // console.log(e);
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
    });
    window.addEventListener("mousemove", (e) => {
      // console.log(e.x, e.y);
      if (this.mouse.pressed) {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
        // console.log(this.mouse);
      }
    });
    window.addEventListener("mousedown", (e) => {
      this.mouse.pressed = true;
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    window.addEventListener("mouseup", (e) => {
      this.mouse.pressed = false;
    });
  }

  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i += 1) {
      this.particles.push(new Particle(this, i));
    }
  }

  handleParticles(context) {
    this.connectParticles(context);
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }

  connectParticles(context) {
    const maxDistance = 100;
    for (let a = 0; a < this.particles.length; a += 1) {
      for (let b = a; b < this.particles.length; b += 1) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        // const distance = Math.sqrt(dx * dx + dy * dy);
        const distance = Math.hypot(dx, dy); // same
        if (distance < maxDistance) {
          context.save();
          const opacity = 1 - distance / maxDistance;
          context.globalAlpha = opacity;
          context.beginPath();
          context.moveTo(this.particles[a].x, this.particles[a].y);
          context.lineTo(this.particles[b].x, this.particles[b].y);
          context.stroke();
          context.restore();
        }
      }
    }
  }
  //
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    // resize event resets context to its default so:
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); // x0 y0 x1 y1
    gradient.addColorStop(0, "pink");
    gradient.addColorStop(0.5, "red");
    gradient.addColorStop(1, "magenta");
    this.context.fillStyle = gradient;
    // this.context.strokeStyle = "white";

    this.particles.forEach((particle) => particle.reset());
  }
}

const effect = new Effect(canvas, ctx);
effect.handleParticles(ctx);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  requestAnimationFrame(animate);
}
animate();
