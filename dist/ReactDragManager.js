class TypedMap extends Map {
    set(key, value) {
        super.set(key, value);
        return this;
    }
    get(key) {
        return super.get(key);
    }
}
//Event types:
const DRAG_STARTED = "DRAG_STARTED";
const DRAG_ENTERED = "DRAG_ENTERED";
const DRAG_EXITED = "DRAG_EXITED";
const DRAG_ENDED = "DRAG_ENDED";
export default class ReactDragManager {
    constructor() {
        this.draggableItems = new TypedMap();
        this.dragSurfaces = new TypedMap();
        this.startingTopPosition = 0;
        this.startingLeftPosition = 0;
        this.mouseXPos = 0;
        this.mouseYPos = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.currentDragNode = null;
        this.currentNodeOldIndex = "";
        this.currentSurfaceNode = null;
        this.eventListeners = {
            DRAG_STARTED: {},
            DRAG_ENTERED: {},
            DRAG_EXITED: {},
            DRAG_ENDED: {},
        };
    }
    addEventListener(type, className, callback) {
        if (this.eventListeners[type][className]) {
            this.eventListeners[type][className].push(callback);
        }
        else {
            this.eventListeners[type][className] = [callback];
        }
    }
    ////////NEED TO FIGURE OUT WHY IF STATEMENT IS HERE//////////////////
    addDragItem(node, item) {
        if (item && item.className.includes("*")) {
            // const hello = "hello";
            // console.log(hello);
        }
        this.draggableItems.set(node, item);
        setupDragItemEventListeners(node, this);
    }
    ///// WHAT PURPOSE IS NEXT LINE?///////////////////////////////////
    removeDragItem(node, item) { }
    addDragSurface(node, item) {
        if (item && item.className.includes("*")) {
            // const hello = "hello";
            // console.log(hello);
        }
        this.dragSurfaces.set(node, item);
        setupDragSurfaceEventListeners(node, this);
    }
    removeDragSurface(node, item) { }
    initiateDragStartedEvent() {
        const currentDragItem = this.draggableItems.get(this.currentDragNode);
        if (!currentDragItem) {
            return;
        }
        const classesToFire = currentDragItem.className.split(" ");
        if (classesToFire.length) {
            classesToFire.forEach(className => {
                this.triggerEvent(DRAG_STARTED, className, currentDragItem, null);
            });
        }
    }
    initiateDragEndedEvent() {
        const currentDragItem = this.draggableItems.get(this.currentDragNode);
        if (!currentDragItem) {
            return;
        }
        const currentDragSurface = this.dragSurfaces.get(this.currentSurfaceNode);
        let classesToFire;
        if (!currentDragSurface) {
            classesToFire = currentDragItem.className.split(" ");
        }
        else {
            classesToFire = getCommonClasses(currentDragItem.className, currentDragSurface.className);
        }
        if (classesToFire.length) {
            classesToFire.forEach(className => {
                this.triggerEvent(DRAG_ENDED, className, currentDragItem, currentDragSurface);
            });
        }
    }
    checkDragEnteredEvent() {
        const currentDragItem = this.draggableItems.get(this.currentDragNode);
        const currentDragSurface = this.dragSurfaces.get(this.currentSurfaceNode);
        if (!currentDragItem || !currentDragSurface) {
            return;
        }
        const classesToFire = getCommonClasses(currentDragItem.className, currentDragSurface.className);
        if (classesToFire.length) {
            classesToFire.forEach(className => {
                this.triggerEvent(DRAG_ENTERED, className, currentDragItem, currentDragSurface);
            });
        }
    }
    checkDragExitedEvent() {
        const currentDragItem = this.draggableItems.get(this.currentDragNode);
        const currentDragSurface = this.dragSurfaces.get(this.currentSurfaceNode);
        if (!currentDragItem || !currentDragSurface) {
            return;
        }
        const classesToFire = getCommonClasses(currentDragItem.className, currentDragSurface.className);
        if (classesToFire.length) {
            classesToFire.forEach(className => {
                this.triggerEvent(DRAG_EXITED, className, currentDragItem, currentDragSurface);
            });
        }
    }
    triggerEvent(type, className, currentDragItem, currentDragSurface) {
        const listeners = this.eventListeners[type][className];
        if (listeners) {
            // console.log(listeners);
            listeners.forEach(listener => {
                listener(currentDragItem, currentDragSurface);
            });
        }
    }
}
function setupDragItemEventListeners(node, manager) {
    node.onmousedown = (e) => {
        e = e || window.event;
        e.preventDefault();
        manager.currentDragNode = node;
        manager.startingTopPosition = node.offsetTop;
        manager.startingLeftPosition = node.offsetLeft;
        // the following is equivilent to 3 and 4
        manager.mouseXPos = e.clientX;
        manager.mouseYPos = e.clientY;
        manager.currentNodeOldIndex = node.style.zIndex;
        node.style.zIndex = "9999";
        //
        manager.initiateDragStartedEvent();
        document.onmousemove = (e) => {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            manager.deltaX = manager.mouseXPos - e.clientX;
            manager.deltaY = manager.mouseYPos - e.clientY;
            manager.mouseXPos = e.clientX;
            manager.mouseYPos = e.clientY;
            // set the element's new position:
            node.style.left = node.offsetLeft - manager.deltaX + "px";
            node.style.top = node.offsetTop - manager.deltaY + "px";
        };
        document.onmouseup = (e) => {
            manager.initiateDragEndedEvent();
            manager.currentDragNode = null;
            document.onmouseup = null;
            document.onmousemove = null;
            node.style.pointerEvents = "";
            node.style.zIndex = manager.currentNodeOldIndex;
            // node.style.backgroundColor = "green";
        };
        // call a function whenever the cursor moves:
        // insure that the dragged element is ignored for pointer (mouse) events to allow events to pass
        // through to elements beneath
        node.style.pointerEvents = "none";
        // node.style.backgroundColor = "yellow";
    };
}
const defaultManager = new ReactDragManager();
export function getDefaultManager() {
    return defaultManager;
}
function setupDragSurfaceEventListeners(node, manager) {
    node.onmouseenter = (e) => {
        manager.currentSurfaceNode = node;
        // Tell drag surface that the mouse is dragging an item over it.
        if (manager.currentDragNode) {
            manager.checkDragEnteredEvent();
        }
    };
    node.onmouseleave = (e) => {
        if (manager.currentDragNode) {
            manager.checkDragExitedEvent();
        }
        if (manager.currentSurfaceNode === node) {
            manager.currentSurfaceNode = null;
        }
    };
}
function getCommonClasses(string1, string2) {
    const classes1 = string1.split(" ");
    const classes2 = string2.split(" ");
    return classes1.filter(className => {
        return classes2.includes(className);
    });
}
