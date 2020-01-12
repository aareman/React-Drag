# React-Drag
A Library for Drag and Drop interactions in react.

Run npm i @darthbane/react-drag to install.

There are four things you can import from this library: 1) Draggable 2) Dragsurface 3) ReactDragManager 4) getDefaultManager.

Draggable:

This is a react component that makes a draggable component out of all it's children.
Below is an example:

\<Draggable>
    This text is draggable!
\</Draggable>

If you wish to make it interactive, you will need to add an item prop. The item prop is an object that must contain a className key which is a string of classes seperated by a space, and may contain a data object which can contain any values. So for example:

\<Draggable item={{className: "SOME_CLASSNAME SOME_OTHER_CLASSNAME", data: {id: 3, value: 100}}}>
  \<img>
\</Draggable>

DragSurface:

This is a react component that makes a surface component out of all it's children. The surface interacts with all items that share it's item classNames.
Below is an example:

\<Draggable item={{className: "red blue", data: {id: 13, color: "purple"}}}>
  \<img>
\</Draggable>

\<Draggable item={{className: "green blue", data: {id: 2, color: "greenish blue"}}}>
  \<img>
\</Draggable>

\<Dragsurface item={{className: "blue orange", data: {value: 100}}}>
  \<img>
\</Draggable>

\<Dragsurface item={{className: "green", data: {onEnter: SOME_FUNCTION}}}>
  \<img>
\</Draggable>

In this example, the drag surface with a class name of blue will interact with both draggble components. While the drag surface with a class name of green will only interact with the second draggable component.All though these interactions take place, you will need to add event listeners to listen for them.

ReactDragManager:

A manager that keeps track of all draggable and drag surface components and their interactions. Generally, it is not necessary to create one, but rather use the built in defualt one.

getDefualtManager:

This function when invoked will return the defualt ReactDragManager. Once retrieved, you may add event listeners to it to take advantage of the interactions. So for example:

const manager = getDefaultManager();
manager.addEventListener("DRAG_ENTERED", "CLASS_NAME", (dragItem, dragSurface) => {
  CODE TO RUN WHEN INVOKED (when interaction takes place with said item and surface)
});
