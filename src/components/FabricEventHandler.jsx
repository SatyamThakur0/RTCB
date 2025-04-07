export const sendCanvasData = (e, canvas, socket, roomId) => {
  if (canvas && socket) {
    const canvasData = canvas.toJSON();
    socket.emit("canvasUpdate", { canvasData, roomId }); // Broadcast canvas changes
  }
};
export const modifyCanvasData = (e, canvas, socket, roomId) => {

  if (canvas && socket) {
    if (e.target.type === "i-text") {
      socket.emit("textChanged", { obj: e.target, roomId });
    }
  }
};
export const updateCanvas = (e, canvas, socket, roomId) => {};

export const movedCanvas = (e, canvas, socket, roomId) => {
  let targetObjs = [];
  canvas.getActiveObjects().map((obj) => {
      targetObjs.push({ id: obj.id, top: obj.top, left: obj.left });
    });
  if (socket) socket.emit("moved", { objs: targetObjs, roomId });
};
export const rotateCanvas = (e, canvas, socket, roomId) => {
  let targetObjs = [];
  canvas.getActiveObjects().map((obj) => {
    targetObjs.push({
      id: obj.id,
      angle: obj.angle,
      top: obj.top,
      left: obj.left,
    });
  });
  if (socket) socket.emit("rotated", { objs: targetObjs, roomId });
};
export const scaledCanvas = (e, canvas, socket, roomId) => {
  let targetObjs = [];
  canvas.getActiveObjects().map((obj) => {
    targetObjs.push({
      id: obj.id,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
    });
  });
  if (socket) socket.emit("scaled", { objs: targetObjs, roomId });
};
export const selectedCanvas = (e, canvas, socket, roomId) => {};
export const clearSelection = (canvas, socket, objs, roomId) => {
  if (socket) socket.emit("clearSelection", { objs, roomId });
};

export const getObjByID = (canvas, id) => {
  return canvas.getObjects().filter((ob) => ob.id === id)[0];
};

export const getSelectedObjects = (canvas) => {
  let objs = canvas.getActiveObjects();
  return objs;
};

export const addId = (shape) => {
  shape.toObject = (function (toObject) {
    return function () {
      const obj = toObject.call(this);
      obj.id = this.id;
      return obj;
    };
  })(shape.toObject);
};
