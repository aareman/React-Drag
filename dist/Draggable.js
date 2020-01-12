import React from "react";
import { getDefaultManager } from "./ReactDragManager";
const manager = getDefaultManager();
export default class Draggable extends React.Component {
    constructor(props) {
        super(props);
        this.nodeRef = React.createRef();
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
        this.manager.addDragItem(this.nodeRef.current, this.item);
    }
    componentWillUnmount() {
        this.manager.removeDragItem(this.nodeRef.current, this.item);
    }
    render() {
        let { style, children } = this;
        return (React.createElement("div", { style: style, ref: this.nodeRef }, children));
    }
}
