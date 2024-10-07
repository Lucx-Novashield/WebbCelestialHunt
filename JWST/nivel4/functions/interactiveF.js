export function interactiveF(selectedObj, eKey, rKey, bKey, skey){


    if (Phaser.Input.Keyboard.JustDown(bKey)) {
        if(selectedObj.scaleX < scale*2){
          selectedObj.setScale(selectedObj.scaleX + 0.1, selectedObj.scaleY + 0.1);
        }
    }
    if (Phaser.Input.Keyboard.JustDown(skey)) {
      if(selectedObj.scaleX >= 0.1){
        selectedObj.setScale(selectedObj.scaleX - 0.1, selectedObj.scaleY - 0.1);
      }
    }
    if (Phaser.Input.Keyboard.JustDown(rKey)){
      selectedObj.angle += 45;
    }
    if (Phaser.Input.Keyboard.JustDown(eKey)) {
      if (selectedObj) {
          selectedObj.destroy(); // Erase the selected object
          selectedObj = null; // Deselect after deletion
      }
    }
    
}