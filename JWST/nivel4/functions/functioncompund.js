import { makeDraggable } from "./draggable";

export function functionC(selectedObj){
    selectedObj.setInteractive();
    selectedObj.on('pointerdown', () =>{
        selectedObj.setTint(0xff0000);
        makeDraggable(selectedObj, true);
    });
}