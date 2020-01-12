import React, { ReactNode } from "react";
import ReactDragManager from "./ReactDragManager";
export declare type DragSurfaceItem = {
    className: String;
    data?: {
        [prop: string]: any;
    };
};
declare type DragSurfaceProps = {
    item?: DragSurfaceItem;
    children: ReactNode;
    style?: React.CSSProperties;
    manager?: ReactDragManager;
};
export default class DragSurface extends React.Component<DragSurfaceProps> {
    private style;
    private surface;
    private children;
    private manager;
    private nodeRef;
    constructor(props: DragSurfaceProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
