
// Calculate ratio between two [R,G,B] colors
function calculateRatioTest(mainColor, newColor, contrastDirection) {
  // (L1 + 0.05) / (L2 + 0.05), where
  // L1 is the relative luminance of the lighter of the colors, and
  // L2 is the relative luminance of the darker of the colors.
  if (contrastDirection == "lighter") {
    var contrastRatio = (calculateRelativeLuminance(mainColor) + 0.05) / (calculateRelativeLuminance(newColor) + 0.05)
  }

  if (contrastRatio >= 5) {
    var highContrast = HexToHSL(RGBToHex(newColor[0], newColor[1], newColor[2]));
    return true
  }
}
var white = [0,100,99]
var colorArray = ""
for (var hue = 0; hue < 360; hue++) {
  for (var lightness = 100; lightness > 0; lightness--) {
    if (calculateRatioTest(HSLToRGB(0,100,99), HSLToRGB(hue,80,lightness), "lighter")) {
      if (lightness > 30){
        var arr = "[" + hue + ",80," + lightness + "],"
        colorArray += arr
        lightness = 0;
      }
    }
  }
}
console.log(colorArray)
