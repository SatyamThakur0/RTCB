import { useContext, useEffect } from "react";
import * as fabric from "fabric";
import { getObjByID } from "./FabricEventHandler";
import { socketContext } from "../../store/socketContext";
import { useCanvas } from "../../store/canvasContext.jsx";
function SocketEventHandler({canvas}) {
    const socket = useContext(socketContext);
    useEffect(() => {

        socket.on("receivedFreePath", (path) => {
            let fabricObject = new fabric.Path(path.path, {
                stroke: path.stroke,
                top: path.top,
                left: path.left,
                fill: "transparent",
                id: path.id,
            });
            canvas.add(fabricObject);
            canvas.renderAll();
            // console.log(path);
        });
        socket.on("clearedShapes", (shapes) => {
            // console.log(shapes);
            shapes.forEach((element) => {
                canvas.remove(getObjByID(canvas, element));
            });
            canvas.discardActiveObject();
            canvas.renderAll();
        });

        socket.on("receiveText", (obj) => {
            let textObj = getObjByID(canvas, obj.id);
            if (textObj) {
                textObj?.set({ text: obj.text });
                textObj?.setCoords();
            }
            canvas.renderAll();
        });
        socket.on("movedShape", (objs) => {
            console.log("moved");
            objs.forEach((el) => {
                let obj = getObjByID(canvas, el.id);
                obj?.set({ top: el.top, left: el.left });
                obj?.setCoords();
            });
            canvas.renderAll();
        });

        socket.on("scaledShape", (objs) => {
            objs.forEach((el) => {
                let obj = getObjByID(canvas, el.id);
                obj?.set({ scaleX: el.scaleX, scaleY: el.scaleY });
                obj?.setCoords();
            });
            canvas.renderAll();
        });
        socket.on("rotatedShape", (objs) => {
            objs.forEach((el) => {
                let obj = getObjByID(canvas, el.id);
                obj?.set({ angle: el.angle, top: el.top, left: el.left });
                obj?.setCoords();
            });
            canvas.renderAll();
        });

        socket.on("receivedShape", (shape) => {
            console.log("shape received ", shape);

            let fabricObject;
            if (shape.type === "Rect") {
                fabricObject = new fabric.Rect({
                    left: shape.left,
                    top: shape.top,
                    width: shape.width,
                    stroke: shape.stroke,
                    strokeWidth: 2,
                    height: shape.height,
                    fill: shape.fill,
                    id: shape.id,
                });
            } else if (shape.type === "Circle") {
                fabricObject = new fabric.Circle({
                    left: shape.left,
                    top: shape.top,
                    stroke: shape.stroke,
                    strokeWidth: 2,
                    radius: shape.radius,
                    fill: shape.fill,
                    id: shape.id,
                });
            } else if (shape.type === "Line") {
                fabricObject = new fabric.Line([50, 100, 200, 100], {
                    stroke: shape.stroke,
                    id: shape.id,
                });
            } else if (shape.type === "Path") {
                fabricObject = new fabric.Path(
                    "M 0 0 L 200 0 L 190 -10 M 200 0 L 190 10",
                    {
                        stroke: shape.stroke,
                        top: 100,
                        left: 100,
                        fill: "transparent",
                        id: shape.id,
                    }
                );
            } else if (shape.type === "IText") {
                fabricObject = new fabric.IText("Type here", {
                    left: 100,
                    top: 100,
                    fill: shape.fill,
                    id: shape.id,
                });
            }

            fabricObject.toObject = (function (toObject) {
                return function () {
                    const obj = toObject.call(this);
                    obj.id = this.id;
                    return obj;
                };
            })(fabricObject.toObject);
            // console.log(fabricObject);
            // console.log(canvas);

            if (fabricObject && canvas) {
                canvas.add(fabricObject);
                canvas.renderAll();
            }
        });
        // }
        return () => {
            if (socket) {
                socket.off("receivedShape");
                socket.off("receivedFreePath");
                socket.off("clearedShapes");
                socket.off("receiveText");
                socket.off("movedShape");
                socket.off("scaledShape");
                socket.off("rotatedShape");
            }
        };
    }, [socket, canvas]);
}

export default SocketEventHandler;
