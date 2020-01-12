import { ReactNode } from "react";
import { DraggableItem } from "./Draggable";
import { DragSurfaceItem } from "./DragSurface";
declare type DragItem = DraggableItem | DragSurfaceItem | null;
declare class TypedMap extends Map {
    set(key: HTMLDivElement, value: DragItem): this;
    get(key: HTMLDivElement): DragItem;
}
declare type DragEvent = "DRAG_STARTED" | "DRAG_ENTERED" | "DRAG_EXITED" | "DRAG_ENDED";
declare type EventListeners = {
    [prop: string]: Function[];
};
declare type EventListenerManager = {
    DRAG_STARTED: EventListeners;
    DRAG_ENTERED: EventListeners;
    DRAG_EXITED: EventListeners;
    DRAG_ENDED: EventListeners;
};
export default class ReactDragManager {
    draggableItems: TypedMap;
    dragSurfaces: TypedMap;
    startingTopPosition: number;
    startingLeftPosition: number;
    mouseXPos: number;
    mouseYPos: number;
    deltaX: number;
    deltaY: number;
    currentDragNode: HTMLDivElement | null;
    currentNodeOldIndex: string;
    currentSurfaceNode: HTMLDivElement | null;
    eventListeners: EventListenerManager;
    addEventListener(type: DragEvent, className: string, callback: Function): void;
    addDragItem(node: HTMLDivElement, item: DraggableItem | null): void;
    removeDragItem(node: ReactNode, item: DraggableItem | null): void;
    addDragSurface(node: HTMLDivElement, item: DragSurfaceItem | null): void;
    removeDragSurface(node: ReactNode, item: DragSurfaceItem | null): void;
    initiateDragStartedEvent(): void;
    initiateDragEndedEvent(): void;
    checkDragEnteredEvent(): void;
    checkDragExitedEvent(): void;
    triggerEvent(type: DragEvent, className: string, currentDragItem: DragItem, currentDragSurface: DragItem): void;
}
export declare function getDefaultManager(): ReactDragManager;
export {};
