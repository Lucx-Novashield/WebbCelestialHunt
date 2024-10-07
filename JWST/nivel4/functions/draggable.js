export function makeDraggable(gameObject, enableLogs = false) {
    gameObject.setInteractive();

    let offsetX = 0;
    let offsetY = 0;

    function log(message) {
        if (enableLogs) {
            console.debug(message);
        }
    }

    function onDrag(pointer) {
        log(`[makeDraggable:onDrag] invoked for game object: ${gameObject.name}`);
        gameObject.x = pointer.x - offsetX;
        gameObject.y = pointer.y - offsetY;
    }

    function stopDrag() {
        log(`[makeDraggable:stopDrag] invoked for game object: ${gameObject.name}`);
        gameObject.on(Phaser.Input.Events.POINTER_DOWN, startDrag); // Re-enable start drag on pointer down
        gameObject.off(Phaser.Input.Events.POINTER_UP, stopDrag);
        gameObject.off(Phaser.Input.Events.POINTER_MOVE, onDrag); // Stop listening to pointer movement
    }

    function startDrag(pointer) {
        log(`[makeDraggable:startDrag] invoked for game object: ${gameObject.name}`);
        
        // Calculate offset when the drag starts
        offsetX = pointer.x - gameObject.x;
        offsetY = pointer.y - gameObject.y;
        
        gameObject.off(Phaser.Input.Events.POINTER_DOWN, startDrag); // Disable start drag on pointer down
        gameObject.on(Phaser.Input.Events.POINTER_UP, stopDrag); // Enable stop drag on pointer up
        gameObject.on(Phaser.Input.Events.POINTER_MOVE, onDrag); // Start listening to pointer movement
    }

    function destroy() {
        gameObject.off(Phaser.Input.Events.POINTER_DOWN, startDrag);
        gameObject.off(Phaser.Input.Events.POINTER_UP, stopDrag);
        gameObject.off(Phaser.Input.Events.POINTER_MOVE, onDrag);
    }

    // Start listening for pointer down to initiate drag
    gameObject.on(Phaser.Input.Events.POINTER_DOWN, startDrag);
    // Listen for when the object is destroyed and clean up the event listeners
    gameObject.on(Phaser.GameObjects.Events.DESTROY, destroy);
}