//
// App stuff
//

// Load app data
var app = new Vue({
  el: '#app',
  data: {
    meta:
      { title: "Color Contrast Generator", version: "v1.0", author: "Sjors Wijsman" },
    colors: [
      { ratio: "7:1",   contrast: "lighter", hex: "", status: "" },
      { ratio: "4.5:1", contrast: "lighter", hex: "", status: "" },
      { ratio: "3:1",   contrast: "lighter", hex: "", status: "" },
      { ratio: "3:1",   contrast: "darker", hex: "", status: "" },
      { ratio: "4.5:1", contrast: "darker", hex: "", status: "" },
      { ratio: "7:1",   contrast: "darker", hex: "", status: "" },
    ]
  }
})

// Set order
var elements = document.getElementsByClassName("colorBlock");
for (var i = 0; i < elements.length; i++) {
  elements[i].style.order = i;
}

// Set height & status message on hover
function colorHover(element) {
  var elements = document.getElementsByClassName("colorBlock");
  var sizeChange = 12;
  if (!element.style.height) {
    resetHeight();
  }
  if (!element.classList.contains("disabled")){
    for (item of elements) {
      // Select first 3 color blocks
      if (element.style.order < 3 && item.style.order < 3) {
        item.style.height = eval(item.style.height.slice(0, -2)) - sizeChange + "px";
      }
      // Select last 3 color blocks
      else if (element.style.order >= 3 && item.style.order >= 3) {
        item.style.height = eval(item.style.height.slice(0, -2)) - sizeChange + "px";
      }
    }
    if (element.style.order < 3) {
      element.style.height = eval(item.style.height.slice(0, -2)) + sizeChange * 2 + "px";
    }
    else if (element.style.order >= 3) {
      element.style.height = eval(item.style.height.slice(0, -2)) + sizeChange * 3 + "px";
    }
    if (!document.getElementsByClassName("statusMessage")[0].classList.contains("error")) {
      setStatusMessage(element.getElementsByClassName("hexText")[0].innerHTML);
    }
  }
}

// Reset height to 100px per block
function resetHeight() {
  var elements = document.getElementsByClassName("colorBlock");
  if (!document.getElementById("colorInput").value && !document.getElementsByClassName("statusMessage")[0].classList.contains("error")) {
    setStatusMessage("Insert Your Color Here!");
  }
  for (item of elements) {
    item.style.height = "100px";
  }
}

function copyColor(element) {
  if (!element.classList.contains("disabled")){
    navigator.clipboard.writeText(element.getElementsByClassName("hexText")[0].innerHTML).then(function() {
      setStatusMessage("Copied color: " + element.getElementsByClassName("hexText")[0].innerHTML, "succes");
    }, function(err) {
      console.error('Could not copy text: ', err);
    });
  }
}

// Generate colors on input
function getInput() {
  var input = document.getElementById("colorInput").value;
  document.getElementsByClassName("statusMessage")[0].classList.remove("succes");
  // Check if input has at least 7 characters
  if (input.length < 7) {
    setColor(undefined);
    document.getElementById("colorInput").classList.remove("error");
    setStatusMessage();
  }
  // If 7 characters
  else {
    if (validateHex(input)) {
      setColor(input);
      document.getElementById("colorInput").classList.remove("error");
      setStatusMessage();
    }
    else {
      setColor(undefined);
      document.getElementById("colorInput").classList.add("error");
      setStatusMessage("Invalid Hex Code", "error");
    }
  }
  if (!document.getElementById("colorInput").value && !document.getElementsByClassName("statusMessage")[0].classList.contains("error")) {
    setStatusMessage("Insert Your Color Here!");
  }
}

function setStatusMessage(message=false, status=false) {
  element = document.getElementsByClassName("statusMessage")[0];
  element.classList.remove("succes", "error");
  if (!message) {
    element.innerHTML = "";
  } else {
    element.innerHTML = message;
  }
  if (status) {
    if (status == "succes") {
      element.classList.add("succes");
    } else  if (status == "error") {
      element.classList.add("error");
    }
  }
}

// Validate 6 digit hex
function validateHex(hex) {
  const regex = /^#[0-9A-Fa-f]{6}$/gm
  return regex.test(hex)
}

// Open details
function openDetails(open) {
  if (open) {
    document.getElementById("app-container").style.transform = "rotateY(180deg)";
  } else {
    document.getElementById("app-container").style.transform = "rotateY(0deg)";
  }
}




//
// All the color stuff
//
function setColor(mainColor) {
  // If main color given, generate contrast colors
  if (mainColor) {
    document.getElementsByClassName("colorPicker")[0].style.backgroundColor = mainColor;
    // Reset first
    generateContrastColors(mainColor, true);
    // Generate new colors
    app.colors = generateContrastColors(mainColor);
  }
  // Else, reset
  else {
    document.getElementsByClassName("colorPicker")[0].style.backgroundColor = "";
    generateContrastColors(mainColor, true);
  }
}

// Generate random 6 digit hex code
function generateRandomHex() {
   var result = "#";
   var characters = "ABCDEF0123456789";
   var charactersLength = characters.length;
   for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
// Set random color for preview
var randomColor = generateRandomHex()
document.getElementById("colorInput").placeholder = randomColor;
setColor(randomColor);

// Generate all contrast colors and return to data table
function generateContrastColors(mainColor, reset=false) {
  var colors = [
    { ratio: "7:1",   contrast: "lighter", hex: "#FFFFFF", status: "" },
    { ratio: "4.5:1", contrast: "lighter", hex: "#FFFFFF", status: "" },
    { ratio: "3:1",   contrast: "lighter", hex: "#FFFFFF", status: "" },
    { ratio: "3:1",   contrast: "darker", hex: "#000000", status: "" },
    { ratio: "4.5:1", contrast: "darker", hex: "#000000", status: "" },
    { ratio: "7:1",   contrast: "darker", hex: "#000000", status: "" },
  ];

  if (!reset) {
    var mainColorHSL = HexToHSL(mainColor);
    var lightness = Math.round(mainColorHSL[2]);
    mainColorHSL[2] = lightness;
    var newColor = [mainColorHSL[0], mainColorHSL[1], mainColorHSL[2]];

    // Calculate Lighter colors
    for (var i = lightness+1; i <= 100; i++) {
      newColor[2] = i;
      var result = calculateRatio(HSLToRGB(mainColorHSL[0],mainColorHSL[1],mainColorHSL[2]), HSLToRGB(newColor[0],newColor[1],newColor[2]), "lighter");
      // Low contrast lighter
      if (result[0] && !colors[2].status) {
        colors[2].hex = result[0].toUpperCase();
        colors[2].status = "pass";
      }
      // Mid contrast lighter
      if (result[1] && !colors[1].status) {
        colors[1].hex = result[1].toUpperCase();
        colors[1].status = "pass";
      }
      // High contrast lighter
      if (result[2] && !colors[0].status) {
        colors[0].hex = result[2].toUpperCase();
        colors[0].status = "pass";
      }
    }

    // Calculate Darker colors
    for (var i = lightness-1; i >= 0; i--) {
      newColor[2] = i;
      var result = calculateRatio(HSLToRGB(mainColorHSL[0],mainColorHSL[1],mainColorHSL[2]), HSLToRGB(newColor[0],newColor[1],newColor[2]), "darker");
      // Low contrast darker
      if (result[0] && !colors[3].status) {
        colors[3].hex = result[0].toUpperCase();
        colors[3].status = "pass";
      }
      // Mid contrast darker
      if (result[1] && !colors[4].status) {
        colors[4].hex = result[1].toUpperCase();
        colors[4].status = "pass";
      }
      // High contrast darker
      if (result[2] && !colors[5].status) {
        colors[5].hex = result[2].toUpperCase();
        colors[5].status = "pass";
      }
    }

    // Set colors, status & info of the colorblocks
    var colorBlocks = document.getElementsByClassName("colorBlock");
    for (var i=0, item; item = colorBlocks[i]; i++) {
      // Set dark fail colors
      if (colors[i].contrast == "darker" && colors[i].status == "") {
        item.style.color = "var(--color-light-black)";
        item.style.backgroundColor = "var(--color-dark-black)";
        item.getElementsByClassName("ratio")[0].style.backgroundColor = "var(--color-black)";
        item.getElementsByClassName("ratio")[0].style.color = "var(--color-light-black)";
      }
      if (colors[i].status == "") {
        item.classList.add("disabled");
      }
      else if (colors[i].status == "pass") {
        item.classList.remove("disabled");
        // Set block background color
        item.style.backgroundColor = colors[i].hex;
        // Set block foreground colors
        item.style.color = mainColor;
      }
      // Set hex text
      item.getElementsByClassName("hexText")[0].innerHTML = colors[i].hex;
    }
  }


  // Reset
  else {
    // Reset contrast status
    for (var i = 0; i < colors.length; i++) {
      app.colors[i].status = "";
    }
    // Reset color block
    var colorBlocks = document.getElementsByClassName("colorBlock");
    for (var i=0, item; item = colorBlocks[i]; i++) {
      item.classList.add("disabled");
      // Reset block background color
      item.style.backgroundColor = "";
      // Reset block foreground colors
      item.style.color = "";
      // Reset hex text
      item.getElementsByClassName("hexText")[0].innerHTML = "#FFFFFF";
      // Reset status
      ratioElement = item.getElementsByClassName("ratio")[0]
      ratioElement.style.backgroundColor = "";
      ratioElement.style.color = "";
    }
  }
  return colors;
}

// Calculate ratio between two [R,G,B] colors
function calculateRatio(mainColor, newColor, contrastDirection) {
  // (L1 + 0.05) / (L2 + 0.05), where
  // L1 is the relative luminance of the lighter of the colors, and
  // L2 is the relative luminance of the darker of the colors.
  if (contrastDirection == "lighter") {
    var contrastRatio = (calculateRelativeLuminance(newColor) + 0.05) / (calculateRelativeLuminance(mainColor) + 0.05)
  }
  else {
    var contrastRatio = (calculateRelativeLuminance(mainColor) + 0.05) / (calculateRelativeLuminance(newColor) + 0.05)
  }

  // Check contrast ratios to min ratios
  var lowContrast;
  if (contrastRatio >= 3) {
    lowContrast = RGBToHex(newColor[0], newColor[1], newColor[2]);
  } else {
    lowContrast = undefined;
  };
  var midContrast;
  if (contrastRatio >= 4.5) {
    midContrast = RGBToHex(newColor[0], newColor[1], newColor[2]);
  } else {
    midContrast = undefined;
  };
  var highContrast;
  if (contrastRatio >= 7) {
    highContrast = RGBToHex(newColor[0], newColor[1], newColor[2]);
  } else {
    highContrast = undefined;
  };

  result = [lowContrast, midContrast, highContrast];

  return result;
}

function calculateRelativeLuminance(color) {
  // L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:
  // if RsRGB <= 0.03928 then R = RsRGB/12.92 else R = ((RsRGB+0.055)/1.055) ^ 2.4
  // if GsRGB <= 0.03928 then G = GsRGB/12.92 else G = ((GsRGB+0.055)/1.055) ^ 2.4
  // if BsRGB <= 0.03928 then B = BsRGB/12.92 else B = ((BsRGB+0.055)/1.055) ^ 2.4
  var rRGB = color[0]/255;
  if (rRGB <= 0.04045) {
    var r = rRGB/12.92;
  } else {
    var r = Math.pow((rRGB+0.055)/1.055, 2.4);
  }

  var gRGB = color[1]/255;
  if (gRGB <= 0.04045) {
    var g = gRGB/12.92;
  } else {
    var g = Math.pow((gRGB+0.055)/1.055, 2.4);
  }

  var bRGB = color[2]/255;
  if (bRGB <= 0.04045) {
    var b = bRGB/12.92;
  } else {
    var b = Math.pow((bRGB+0.055)/1.055, 2.4);
  }

  var luminance = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
  return luminance
}
