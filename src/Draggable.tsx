import React, { ReactNode } from "react";
import ReactDragManager, { getDefaultManager } from "./ReactDragManager";

const manager = getDefaultManager();

export type DraggableItem = {
    className: String;
    data?: { [prop: string]: any };
};

type DraggableProps = {
    item?: DraggableItem;
    children: ReactNode;
    style?: React.CSSProperties;
    manager?: ReactDragManager;
};

export default class Draggable extends React.Component<DraggableProps> {
    // makeNodeDraggable: Function;
    private style: React.CSSProperties;
    private item: DraggableItem | null;
    private children: ReactNode;
    private manager: ReactDragManager;
    private nodeRef = React.createRef<HTMLDivElement>();

    constructor(props: DraggableProps) {
        super(props);

        this.style = props.style || {};
        this.style.position = "absolute";
        // this.style.backgroundColor = this.style.backgroundColor || "green";
        // this.style.width = 100;
        // this.style.height = 100;

        this.item = props.item || null;
        if (this.item) {
            this.item.className = this.item.className || "*";
            this.item.className = this.item.className
                .replace(/\s+/g, " ")
                .trim();
        }

        this.children = props.children;

        this.manager = props.manager || manager;
    }

    componentDidMount() {
        this.manager.addDragItem(this.nodeRef.current!, this.item);
    }

    componentWillUnmount() {
        this.manager.removeDragItem(this.nodeRef.current, this.item);
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
