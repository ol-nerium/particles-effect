export default class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.floor(Math.random() * 10 + 1);
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - 2 * this.radius);
    this.vx = Math.random() * 4 - 1.5;
    this.vy = Math.random() * 4 - 1.5;

    this.pushX = 0;
    this.pushY = 0;
    this.friction = 0.8;
  }
  draw(context) {
    // context.fillStyle = `hsl(${this.x * 0.5}, 100%, 50%)`;
    // hue saturation lightness

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    // context.stroke();
  }

  update() {
    if (this.effect.mouse.pressed) {
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const distance = Math.hypot(dx, dy);
      const force = this.effect.mouse.radius / distance;
      if (distance < this.effect.mouse.radius) {
        const angle = Math.atan2(dy, dx); // counterclockwise angle in radians between the positive oX and a line projected from 0,0 towards target (x,y)
        // Value in the range of -PI..+PI

        this.pushY += Math.sin(angle) * force;
        this.pushX += Math.cos(angle) * force;
        // console.log(angle, Math.sin(angle));
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

    this.x += (this.pushX *= this.friction) + this.vx;
    this.y += (this.pushY *= this.friction) + this.vy;
  }

  reset() {
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - 2 * this.radius);
  }
}
