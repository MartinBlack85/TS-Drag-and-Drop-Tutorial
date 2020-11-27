

    // Drag and drop interfaces
    export interface IDragabble {
        // using a built in DOM event as event object
        dragStartHandler(event: DragEvent): void;
        // using a built in DOM event as event object
        dragEndHandler(event: DragEvent): void;
    }

    export interface IDragTarget {
        // Implementing 3 event handlers:
        dragOverHandler(event: DragEvent): void;
        dropHandler(event: DragEvent): void;
        dragLeaveHandler(event: DragEvent): void;
    }


