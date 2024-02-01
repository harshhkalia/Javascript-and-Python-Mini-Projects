function generateColorPalette() {
  var colors = generateRandomColors(5);
  displayColorPalette(colors);
}

function generateRandomColors(count) {
  var colors = [];
  for (var i = 0; i < count; i++) {
    var color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  return colors;
}

function displayColorPalette(colors) {
  var resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  var heading = document.createElement("h5");
  heading.textContent = "Your Palettes";
  heading.style.backgroundColor = "#fff";
  resultDiv.appendChild(heading);

  colors.forEach(function (color) {
    var colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorDiv.className = "color-box";
    colorDiv.textContent = color;
    colorDiv.addEventListener("click", function () {
      copyToClipboard(color);
    });
    resultDiv.appendChild(colorDiv);
  });

  resultDiv.style.display = "block";
  resultDiv.style.width = "200px";
  resultDiv.style.height = "108px";
}

document.addEventListener("DOMContentLoaded", function () {
  var resultDiv = document.getElementById("result");
  resultDiv.style.display = "none";
});

function copyToClipboard(text) {
  var tempInput = document.createElement("input");
  document.body.appendChild(tempInput);
  tempInput.value = text;
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

function generateQRcode() {
  var text = "Hi this is me Harsh Kalia and I like Coding ;-)";
  var resultDiv = document.getElementById("result");
  var img = document.getElementById("qr-code");
  img.src = "/generate_qr_code/" + encodeURIComponent(text);
  var otpImg = document.getElementById("otp-code");
  otpImg.style.display = "none";

  resultDiv.style.display = "block";
  resultDiv.style.width = "50px";
  resultDiv.style.height = "70px";
  resultDiv.style.marginLeft = "100px";
}

function generateOTP() {
  var otpImg = document.getElementById("otp-code");
  var resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.style.width = "50px";
  resultDiv.style.height = "70px";
  resultDiv.style.marginLeft = "100px";
  otpImg.style.backgroundColor = "#fff";
  var qrImg = document.getElementById("qr-code");
  qrImg.style.display = "none";
  otpImg.className = "otp-font";

  var otp = generateRandomOTP();
  otpImg.src = generateOTPBase64(otp);

  function generateRandomOTP() {
    var otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString().padStart(6, "0");
  }

  function generateOTPBase64(otp) {
    var canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.length = 50;
    var ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText(otp, 25, 30);

    var dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
  }
}
