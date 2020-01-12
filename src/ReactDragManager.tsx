import React, { ReactNode, ReactChild } from "react";
import { DraggableItem } from "./Draggable";
import { DragSurfaceItem } from "./DragSurface";

type DragItem = DraggableItem | DragSurfaceItem | null;

class TypedMap extends Map {
    set(key: HTMLDivElement, value: DragItem) {
        super.set(key, value);
        return this;
    }

    get(key: HTMLDivElement): DragItem {
        return super.get(key);
    }
}

//Event types:
const DRAG_STARTED = "DRAG_STARTED";
const DRAG_ENTERED = "DRAG_ENTERED";
const DRAG_EXITED = "DRAG_EXITED";
const DRAG_ENDED = "DRAG_ENDED";

type DragEvent = "DRAG_STARTED" | "DRAG_ENTERED" | "DRAG_EXITED" | "DRAG_ENDED";

type EventListeners = { [prop: string]: Function[] };

type EventListenerManager = {
    DRAG_STARTED: EventListeners;
    DRAG_ENTERED: EventListeners;
    DRAG_EXITED: EventListeners;
    DRAG_ENDED: EventListeners;
};

export default class ReactDragManager {
    draggableItems = new TypedMap();
    dragSurfaces = new TypedMap();
    startingTopPosition: number = 0;
    startingLeftPosition: number = 0;
    mouseXPos: number = 0;
    mouseYPos: number = 0;
    deltaX: number = 0;
    deltaY: number = 0;
    currentDragNode: HTMLDivElement | null = null;
    currentNodeOldIndex: string = "";
    currentSurfaceNode: HTMLDivElement | null = null;
    eventListeners: EventListenerManager = {
        DRAG_STARTED: {},
        DRAG_ENTERED: {},
        DRAG_EXITED: {},
        DRAG_ENDED: {},
    };
    addEventListener(type: DragEvent, className: string, callback: Function) {
        if (this.eventListeners[type][className]) {
            this.eventListeners[type][className].push(callback);
        } else {
            this.eventListeners[type][className] = [callback];
        }
    }

    ////////NEED TO FIGURE OUT WHY IF STATEMENT IS HERE//////////////////
    addDragItem(node: HTMLDivElement, item: DraggableItem | null): void {
        if (item && item.className.includes("*")) {
            // const hello = "hello";
            // console.log(hello);
        }
        this.draggableItems.set(node, item);
        setupDragItemEventListeners(node, this);
    }
    ///// WHAT PURPOSE IS NEXT LINE?///////////////////////////////////
    removeDragItem(node: ReactNode, item: DraggableItem | null): void {}

    addDragSurface(node: HTMLDivElement, item: DragSurfaceItem | null): void {
        if (item && item.className.includes("*")) {
            // const hello = "hello";
            // console.log(hello);
        }
        this.dragSurfaces.set(node, item);
        setupDragSurfaceEventListeners(node, this);
    }
    removeDragSurface(node: ReactNode, item: DragSurfaceItem | null): void {}

    initiateDragStartedEvent() {
        const currentDragItem = this.draggableItems.get(this.currentDragNode!);
        if (!currentDragItem) {
            return;
        }
        const classesToFire = currentDragItem!.className.split(" ");

        if (classesToFire.length) {
            classesToFire.forEach(className => {
                this.triggerEvent(
                    DRAG_STARTED,
                    className,
                    currentDragItem,
                    null
                );
            });
        }
    }

    initiateDragEndedEvent() {
        const currentDragItem = this.draggableItems.get(this.currentDragNode!);
        if (!currentDragItem) {
            return;
        }

        const currentDragSurface = this.dragSurfaces.get(
            this.currentSurfaceNode!
        );

        let classesToFire;
        if (!currentDragSurface) {
            classesToFire = currentDragItem!.className.split(" ");
        } else {
            classesToFire = getCommonClasses(
                currentDragItem.className,
                currentDragSurface.className
            );
        }

        if (classesToFire.length) {
            classesToFire.forEach(className => {
                this.triggerEvent(
                    DRAG_ENDED,
                    className,
                    currentDragItem,
                    currentDragSurface
                );
            });
        }
    }

    checkDragEnteredEvent() {
        const currentDragItem = this.draggableItems.get(this.currentDragNode!);
        const currentDragSurface = this.dragSurfaces.get(
            this.currentSurfaceNode!
        );
        if (!currentDragItem || !currentDragSurface) {
            return;
        }
        const classesToFire = getCommonClasses(
            currentDragItem.className,
            currentDragSurface.className
        );

        if (classesToFire.length) {
            classesToFire.forEach(className => {
                this.triggerEvent(
                    DRAG_ENTERED,
                    className,
                    currentDragItem,
                    currentDragSurface
                );
            });
        }
    }

    checkDragExitedEvent() {
        const currentDragItem = this.draggableItems.get(this.currentDragNode!);
        const currentDragSurface = this.dragSurfaces.get(
            this.currentSurfaceNode!
        );
        if (!currentDragItem || !currentDragSurface) {
            return;
        }
        const classesToFire = getCommonClasses(
            currentDragItem.className,
            currentDragSurface.className
        );

        if (classesToFire.length) {
            classesToFire.forEach(className => {
                this.triggerEvent(
                    DRAG_EXITED,
                    className,
                    currentDragItem,
                    currentDragSurface
                );
            });
        }
    }

    triggerEvent(
        type: DragEvent,
        className: string,
        currentDragItem: DragItem,
        currentDragSurface: DragItem
    ): void {
        const listeners = this.eventListeners[type][className];
        if (listeners) {
            // console.log(listeners);
            listeners.forEach(listener => {
                listener(currentDragItem, currentDragSurface);
            });
        }
    }
}

function setupDragItemEventListeners(
    node: HTMLDivElement,
    manager: ReactDragManager
) {
    node.onmousedown = (e: MouseEvent) => {
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

        document.onmousemove = (e: MouseEvent) => {
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

        document.onmouseup = (e: MouseEvent) => {
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

function setupDragSurfaceEventListeners(
    node: HTMLDivElement,
    manager: ReactDragManager
) {
    node.onmouseenter = (e: MouseEvent) => {
        manager.currentSurfaceNode = node;
        // Tell drag surface that the mouse is dragging an item over it.
        if (manager.currentDragNode) {
            manager.checkDragEnteredEvent();
        }
    };
    node.onmouseleave = (e: MouseEvent) => {
        if (manager.currentDragNode) {
            manager.checkDragExitedEvent();
        }

        if (manager.currentSurfaceNode === node) {
            manager.currentSurfaceNode = null;
        }
    };
}

function getCommonClasses(
    string1: string | String,
    string2: string | String
): string[] {
    const classes1 = string1.split(" ");
    const classes2 = string2.split(" ");
    return classes1.filter(className => {
        return classes2.includes(className);
    });
}
