function setColor(color) {
  document.documentElement.style.setProperty("--input-color", color);
}

function validateHex(hex) {
  const regex = /^#[0-9A-F]{6}$/gm
  return regex.test(hex)
}

function generateRandomHex() {
   var result = "#";
   var characters = "ABCDEF0123456789";
   var charactersLength = characters.length;
   for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
   document.getElementById("colorInput").placeholder = result;
   setColor(result)
}
generateRandomHex()
