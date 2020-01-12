import React, { ReactNode } from "react";
import ReactDragManager from "./ReactDragManager";
export declare type DraggableItem = {
    className: String;
    data?: {
        [prop: string]: any;
    };
};
declare type DraggableProps = {
    item?: DraggableItem;
    children: ReactNode;
    style?: React.CSSProperties;
    manager?: ReactDragManager;
};
export default class Draggable extends React.Component<DraggableProps> {
    private style;
    private item;
    private children;
    private manager;
    private nodeRef;
    constructor(props: DraggableProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
