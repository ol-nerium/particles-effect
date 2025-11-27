class Particle {
  constructor(effect, index) {
    this.index = index;
    this.effect = effect;

    this.pushX = 0.5;
    this.pushY = 0.3;
    this.friction = 0.6;

    this.image = document.getElementById("stars_sprite");

    this.spriteWidth = 50;
    this.spriteHeight = 50;
    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 3);

    this.sizeModifier = Math.random() + 0.4;
    this.width = Math.floor(this.spriteWidth * this.sizeModifier);
    this.height = Math.floor(this.spriteHeight * this.sizeModifier);
    this.buffer = this.width * 2;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this.minSize = this.width;
    this.maxSize = this.width * 2;

    this.x = this.width + Math.random() * (this.effect.width - this.width);
    this.y = this.height + Math.random() * (this.effect.height - this.height);
    this.vx = Math.random() * 1.2 - 0.6;
    this.vy = Math.random() * 1.2 - 0.6;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth, // sx rectangular
      this.frameY * this.spriteHeight, // sy area
      this.spriteWidth, // sw cropped out
      this.spriteHeight, // sh from stylesheet
      this.x - this.halfWidth,
      this.y - this.halfHeight,
      this.width,
      this.height
    );
  }

  update() {
    if (this.effect.mouse.pressed) {
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const distance = Math.hypot(dx, dy);
      const force = this.effect.mouse.radius / distance;
      if (distance < this.effect.mouse.radius && this.width < this.maxSize) {
        this.width += 2;
        this.height += 2;
      }
      if (distance < this.effect.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        this.pushX += Math.cos(angle) * force;
        this.pushY += Math.sin(angle) * force;
      }
    }
    if (this.width > this.minSize) {
      this.width -= 1;
      this.height -= 1;
    }

    if (this.x < this.buffer) {
      this.x = this.buffer;
      this.vx *= -1;
    }
    if (this.x > this.effect.width - this.buffer) {
      this.x = this.effect.width - this.buffer;
      this.vx *= -1;
    }
    if (this.y < this.buffer) {
      this.y = this.buffer;
      this.vy *= -1;
    }
    if (this.y > this.effect.height - this.buffer) {
      this.y = this.effect.height - this.buffer;
      this.vy *= -1;
    }

    this.x += (this.pushX *= this.friction) + this.vx;
    this.y += (this.pushY *= this.friction) + this.vy;
  }

  reset() {
    this.x = this.width + Math.random() * (this.effect.width - this.width);
    this.y = this.height + Math.random() * (this.effect.height - this.height);
  }
}

class Effect {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 250;
    this.createParticles();

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      pressed: false,
      radius: 160,
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
    // this.connectParticles(context);
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

    this.context.strokeStyle = "white";

    this.particles.forEach((particle) => particle.reset());
  }
}

window.addEventListener("load", function () {
  // setup
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.strokeStyle = "white";

  const effect = new Effect(canvas, ctx);
  effect.handleParticles(ctx);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
  }
  animate();
});
