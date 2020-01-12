import React, { ReactNode, ReactChild } from "react";
import ReactDragManager, { getDefaultManager } from "./ReactDragManager";

const manager = getDefaultManager();

export type DragSurfaceItem = {
    className: String;
    data?: { [prop: string]: any };
};

type DragSurfaceProps = {
    item?: DragSurfaceItem;
    children: ReactNode;
    style?: React.CSSProperties;
    manager?: ReactDragManager;
};

export default class DragSurface extends React.Component<DragSurfaceProps> {
    // makeNodeDraggable: Function;
    private style: React.CSSProperties;
    private surface: DragSurfaceItem | null;
    private children: ReactNode;
    private manager: ReactDragManager;
    private nodeRef = React.createRef<HTMLDivElement>();

    constructor(props: DragSurfaceProps) {
        super(props);

        this.style = props.style || {};
        this.style.position = "absolute";
        this.style.backgroundColor = this.style.backgroundColor || "green";
        this.style.width = 100;
        this.style.height = 100;

        this.surface = props.item || null;
        if (this.surface) {
            this.surface.className = this.surface.className || "*";
            this.surface.className = this.surface.className
                .replace(/\s+/g, " ")
                .trim();
        }

        this.children = props.children;

        this.manager = props.manager || manager;
    }

    componentDidMount() {
        this.manager.addDragSurface(this.nodeRef.current!, this.surface);
    }

    componentWillUnmount() {
        this.manager.removeDragSurface(this.nodeRef.current, this.surface);
    }

    render() {
        let { style, children } = this;

        return (
            <div style={style} ref={this.nodeRef}>
                {children}
            </div>
        );
    }
}
