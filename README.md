# React-Drag
A super simple library for **!!!interactive!!!** react dragging.

${toc}

## Installation
```
npm install @darthbane/react-drag
```
or
```
yarn add @darthbane/react-drag
```

## Docs

There are four key elements that this library exposes.
1. `Draggable` - a React component that makes its `children` draggable.
2. `Dragsurface` - a React component that acts as a Drag Surface for all of its `children`. 
3. `ReactDragManager` - a React component that manages all the drag interactions.
4. `getDefaultManager` - returns the default `ReactDragManager`.

### `Draggable`

This is a react component that makes a draggable component out of all it's children.

Here is an example:

```javascript
<Draggable>
    This text is draggable!
</Draggable>
```
Wasn't that easy 😉

If you wish to make it interact with other `Draggable`'s or `DragSurface`'s, you will need to add an item prop. The item prop is an object that must contain a className key which is a string of classes seperated by a space, and may contain a data object which can contain any values. 

```javascript
<Draggable item={{className: "SOME_CLASSNAME SOME_OTHER_CLASSNAME", data: {id: 3, value: 100}}}>
  <img>
</Draggable>
```

### `DragSurface`

This is a react component that makes a surface component out of all it's children. The surface interacts with all items that share it's item classNames.
Below is an example:

```javascript
<Draggable item={{className: "red blue", data: {id: 13, color: "purple"}}}>
    <img>
</Draggable>

<Draggable item={{className: "green blue", data: {id: 2, color: "greenish blue"}}}>
    <img>
</Draggable>

<Dragsurface item={{className: "blue orange", data: {value: 100}}}>
    <img>
</Dragsurface>

<Dragsurface item={{className: "green", data: {onEnter: SOME_FUNCTION}}}>
    <img>
</Dragsurface>
```

In this example, the drag surface with a class name of blue will interact with both draggable components. While the drag surface with a class name of green will only interact with the second draggable component.All though these interactions take place, you will need to add event listeners to listen for them.

### `ReactDragManager`

A manager that keeps track of all draggable and drag surface components and their interactions. Generally, it is not necessary to create one, but rather use the built in default one.

### `getDefaultManager`

This function when invoked will return the default ReactDragManager. Once retrieved, you may add event listeners to it to take advantage of the interactions. So for example:

```javascript
const manager = getDefaultManager();
manager.addEventListener("DRAG_ENTERED", "CLASS_NAME", (dragItem, dragSurface) => {
  //CODE TO RUN WHEN INVOKED (when interaction takes place with said item and surface)
});
```

## Checklist
- [X] Interactive Dragging 🚀
- [ ] Live Demo
- [ ] Complete Docs
- [ ] Test coverage 💼
- [ ] Lint and format 💚
- [ ] Editor config
