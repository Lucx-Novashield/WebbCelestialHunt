import Phaser from "phaser";

export function select(gameObject, enableLogs = false){
    gameObject.setInteractive();

    function log(message){
        if(enableLogs){
            console.debug(message);
        }
    }

    gameObject.on(Phaser.Input.Events.POINTER_UP, )
}