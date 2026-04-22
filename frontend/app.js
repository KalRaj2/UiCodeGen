const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const selector = document.getElementById("selector");
const generate = document.getElementById("generate");
const code = document.getElementById("code");
const frame = document.getElementById("previewFrame");
const preview = document.getElementById("preview");
const img = document.getElementById("img");

let boxes = [];
let drawing = false;
let startX, startY;
let currentIndex = null;

let zoom = 1;
let codeFont = 14;

/* UPLOAD */
upload.addEventListener("change", (e) => {
  const reader = new FileReader();

  reader.onload = (ev) => {
    img.src = ev.target.result;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      img.style.width = img.width + "px";
      img.style.height = img.height + "px";

      boxes = [];
      zoom = 1;
      canvas.style.transform = "scale(1)";
      img.style.transform = "scale(1)";

      draw();
    };
  };

  reader.readAsDataURL(e.target.files[0]);
});

/* DRAW */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  boxes.forEach(b => {
    ctx.strokeStyle = "red";
    ctx.strokeRect(b.x, b.y, b.w, b.h);

    if (b.type) {
      ctx.fillStyle = "red";
      ctx.fillText(b.type, b.x + 5, b.y + 15);
    }
  });
}

/* MOUSE */
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  startX = e.offsetX / zoom;
  startY = e.offsetY / zoom;
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  draw();
  ctx.strokeRect(
    startX,
    startY,
    (e.offsetX / zoom) - startX,
    (e.offsetY / zoom) - startY
  );
});

canvas.addEventListener("mouseup", (e) => {
  drawing = false;

  const endX = e.offsetX / zoom;
  const endY = e.offsetY / zoom;

  const box = {
    x: startX,
    y: startY,
    w: endX - startX,
    h: endY - startY,
    type: null
  };

  boxes.push(box);
  currentIndex = boxes.length - 1;

  draw();

  /* FIXED DROPDOWN POSITION */
  selector.style.display = "block";
  selector.style.left = (box.x * zoom + preview.scrollLeft) + "px";
  selector.style.top = ((box.y + box.h) * zoom + preview.scrollTop) + "px";
});

/* SELECT */
selector.addEventListener("change", () => {
  if (currentIndex === null) return;

  boxes[currentIndex].type = selector.value;
  selector.style.display = "none";
  currentIndex = null;

  draw();
});

/* GENERATE */
generate.addEventListener("click", () => {
  if (!img.src) return;

  let html = `<div style="position:relative;width:${img.width}px;height:${img.height}px;">`;
  html += `<img src="${img.src}" style="position:absolute;width:100%;height:100%;">`;

  boxes.forEach(b => {
    if (!b.type) return;

    if (b.type === "button")
      html += `<button style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;">Button</button>`;

    if (b.type === "input")
      html += `<input style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;">`;

    if (b.type === "checkbox")
      html += `<input type="checkbox" style="position:absolute;left:${b.x}px;top:${b.y}px;">`;

    if (b.type === "text")
      html += `<p style="position:absolute;left:${b.x}px;top:${b.y}px;">Text</p>`;

    if (b.type === "link")
      html += `<a href="#" style="position:absolute;left:${b.x}px;top:${b.y}px;">Link</a>`;
  });

  html += "</div>";

  code.value = html;
  updatePreview();
});

/* LIVE PREVIEW */
code.addEventListener("input", updatePreview);

function updatePreview() {
  const doc = frame.contentWindow.document;
  doc.open();
  doc.write(code.value);
  doc.close();
}

/* ZOOM */
function zoomIn() {
  zoom += 0.1;
  canvas.style.transform = `scale(${zoom})`;
  img.style.transform = `scale(${zoom})`;
  selector.style.display = "none";
}

function zoomOut() {
  zoom -= 0.1;
  if (zoom < 0.2) zoom = 0.2;
  canvas.style.transform = `scale(${zoom})`;
  img.style.transform = `scale(${zoom})`;
  selector.style.display = "none";
}

/* CODE ZOOM */
function codeZoomIn() {
  codeFont += 1;
  code.style.fontSize = codeFont + "px";
}

function codeZoomOut() {
  codeFont -= 1;
  if (codeFont < 10) codeFont = 10;
  code.style.fontSize = codeFont + "px";
}