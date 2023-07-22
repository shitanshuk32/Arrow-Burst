const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const initialCircles = [
  { x: 80, y: 100, radius: 40, color: "#ffd966", hit: false },
  { x: 80, y: 200, radius: 40, color: "#2b78e4", hit: false },
  { x: 80, y: 300, radius: 40, color: "#cc0000", hit: false },
  { x: 80, y: 400, radius: 40, color: "#6aa84f", hit: false },
];

const initialArrows = [
  { x: 550, y: 100, hit: false, moving: false },
  { x: 550, y: 200, hit: false, moving: false },
  { x: 550, y: 300, hit: false, moving: false },
  { x: 550, y: 400, hit: false, moving: false },
];

let circles = [];
let arrows = [];

let animationId;

reset();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach(function (circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = circle.color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(circle.x + 4, circle.y - 4, circle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();
  });

  arrows.forEach(function (arrow, index) {
    if (arrow.hit) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x + 40, arrow.y - 15);
    ctx.lineTo(arrow.x + 40, arrow.y - 5);
    ctx.lineTo(arrow.x + 80, arrow.y - 5);
    ctx.lineTo(arrow.x + 80, arrow.y + 5);
    ctx.lineTo(arrow.x + 40, arrow.y + 5);
    ctx.lineTo(arrow.x + 40, arrow.y + 15);
    ctx.lineTo(arrow.x, arrow.y);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(arrow.x + 4, arrow.y);
    ctx.lineTo(arrow.x + 44, arrow.y - 11);
    ctx.lineTo(arrow.x + 44, arrow.y - 1);
    ctx.lineTo(arrow.x + 84, arrow.y - 1);
    ctx.lineTo(arrow.x + 84, arrow.y + 9);
    ctx.lineTo(arrow.x + 44, arrow.y + 9);
    ctx.lineTo(arrow.x + 44, arrow.y + 19);
    ctx.lineTo(arrow.x + 4, arrow.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();

    if (arrow.moving) {
      const circle = circles[index];
      const speed = 5;
      const directionX = circle.x - arrow.x;
      const directionY = circle.y - arrow.y;
      const distance = Math.sqrt(
        Math.pow(directionX, 2) + Math.pow(directionY, 2)
      );
      const unitDirectionX = directionX / distance;
      const unitDirectionY = directionY / distance;
      arrow.x += unitDirectionX * speed;
      arrow.y += unitDirectionY * speed;

      if (distance < circle.radius) {
        arrow.moving = false;
        arrow.hit = true;
        circles[index].hit = true;
        circles[index].color = "#999999";

        if (
          index < circles.length - 1 &&
          circles[index + 1].color === "#999999"
        ) {
          arrows[index + 1].hit = true;
          circles[index + 1].color = "#999999";
        }
      }
    }
  });

  animationId = requestAnimationFrame(draw);
}

function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  circles.forEach(function (circle, index) {
    if (!circle.hit) {
      const distance = Math.sqrt(
        Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2)
      );
      if (distance < circle.radius) {
        const arrow = arrows[index];

        if (!arrow.moving) {
          arrow.moving = true;
        }
      }
    }
  });
}

canvas.addEventListener("click", handleClick);

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", reset);

animationId = requestAnimationFrame(draw);

function reset() {
  cancelAnimationFrame(animationId);

  circles = JSON.parse(JSON.stringify(initialCircles));
  arrows = JSON.parse(JSON.stringify(initialArrows));

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  animationId = requestAnimationFrame(draw);
}

function allCirclesHit() {
  return circles.every(function (circle) {
    return circle.hit;
  });
}

if (allCirclesHit()) {
  reset();
}
