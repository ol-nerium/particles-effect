import Effect from "./effect.js";

window.addEventListener("load", () => {
  // setup
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); // x0 y0 x1 y1
  gradient.addColorStop(0, "white");
  gradient.addColorStop(0.5, "gold");
  gradient.addColorStop(1, "orangered");
  ctx.fillStyle = gradient;
  ctx.strokeStyle = "white";

  const effect = new Effect(canvas, ctx);

  function animate() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx, gradient);
    requestAnimationFrame(animate);
  }
  animate();
});
