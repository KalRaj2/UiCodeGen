const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const codeArea = document.getElementById('code');

let elements = [];

upload.addEventListener('change', function (e) {
  const file = e.target.files[0];
  const img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = URL.createObjectURL(file);
});

canvas.addEventListener('click', function (e) {
  const x = e.offsetX;
  const y = e.offsetY;

  const type = prompt("Enter element type (button/input/checkbox):");

  elements.push({ x, y, type });

  drawElements();
  generateCode();
});

function drawElements() {
  ctx.fillStyle = "red";
  elements.forEach(el => {
    ctx.fillRect(el.x, el.y, 10, 10);
  });
}

function generateCode() {
  let html = "";

  elements.forEach(el => {
    if (el.type === "button") {
      html += `<button style="position:absolute;left:${el.x}px;top:${el.y}px">Button</button>\n`;
    }
    if (el.type === "input") {
      html += `<input style="position:absolute;left:${el.x}px;top:${el.y}px"/>\n`;
    }
    if (el.type === "checkbox") {
      html += `<input type="checkbox" style="position:absolute;left:${el.x}px;top:${el.y}px"/>\n`;
    }
  });

  codeArea.value = html;
}

function renderPreview() {
  const iframe = document.getElementById('preview');
  iframe.srcdoc = codeArea.value;
}