import React from "react";
import { getDefaultManager } from "./ReactDragManager";
const manager = getDefaultManager();
export default class DragSurface extends React.Component {
    constructor(props) {
        super(props);
        this.nodeRef = React.createRef();
        this.style = props.style || {};
        this.style.position = "absolute";
        // this.style.backgroundColor = this.style.backgroundColor || "green";
        // this.style.width = 100;
        // this.style.height = 100;
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
        this.manager.addDragSurface(this.nodeRef.current, this.surface);
    }
    componentWillUnmount() {
        this.manager.removeDragSurface(this.nodeRef.current, this.surface);
    }
    render() {
        let { style, children } = this;
        return (React.createElement("div", { style: style, ref: this.nodeRef }, children));
    }
}
