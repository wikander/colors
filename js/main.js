var imageCapture;

function onGetUserMediaButtonClick() {
  document.querySelector("video").classList.remove("hidden");
  this.classList.add("hidden");
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((mediaStream) => {
      document.querySelector("video").srcObject = mediaStream;

      const track = mediaStream.getVideoTracks()[0];
      imageCapture = new ImageCapture(track);
    })
    .catch((error) => console.log(error));
}

function onGrabFrameButtonClick() {
  imageCapture
    .grabFrame()
    .then((imageBitmap) => {
      const canvas = document.querySelector("#grabFrameCanvas");
      drawCanvas(canvas, imageBitmap);
    })
    .catch((error) => console.log(error));
}

/* Utils */

function drawCanvas(canvas, img) {
  canvas.width = getComputedStyle(canvas).width.split("px")[0];
  canvas.height = getComputedStyle(canvas).height.split("px")[0];
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  let x = (canvas.width - img.width * ratio) / 2;
  let y = (canvas.height - img.height * ratio) / 2;

  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  canvas
    .getContext("2d")
    .drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      x,
      y,
      img.width * ratio,
      img.height * ratio
    );

  const imageData = canvas
    .getContext("2d")
    .getImageData(0, 0, canvas.width, canvas.height);
  getColor(imageData);
}

function getColor(imageData) {
  const color = [null, null, null];
  const data = imageData.data;
  const pixelCount = imageData.width * imageData.height;

  for (let i = 0; i < pixelCount; i++) {
    const s = i * 4;

    if (color[0] !== null && data[s + 3] === 255) {
      color[0] = color[0] + data[s + 0];
      color[1] = color[1] + data[s + 1];
      color[2] = color[2] + data[s + 2];
    } else if (color[0] === null && data[s + 3] === 255) {
      color[0] = data[s + 0];
      color[1] = data[s + 1];
      color[2] = data[s + 2];
    }
  }

  color[0] = Math.round(color[0] / pixelCount);
  color[1] = Math.round(color[1] / pixelCount);
  color[2] = Math.round(color[2] / pixelCount);
  console.log(color);

  const rgba = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  document.body.style.background = rgba;
}

document.querySelector("video").addEventListener("play", function () {
  // document.querySelector("#grabFrameButton").disabled = false;
});

document
  .querySelector("#getUserMediaButton")
  .addEventListener("click", onGetUserMediaButtonClick);
document
  .querySelector("video")
  .addEventListener("click", onGrabFrameButtonClick);
