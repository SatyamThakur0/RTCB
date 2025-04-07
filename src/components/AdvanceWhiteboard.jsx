import SocketEventHandler from "./SocketEventHandler.jsx";
import {
  sendCanvasData,
  modifyCanvasData,
  movedCanvas,
  scaledCanvas,
  selectedCanvas,
  updateCanvas,
  rotateCanvas,
  clearSelection,
  addId,
} from "./FabricEventHandler.jsx";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useContext, useEffect, useState } from "react";
import * as fabric from "fabric";
import { BsCursorFill } from "react-icons/bs";
import { useCanvas } from "../../store/canvasContext.jsx";
import { socketContext } from "../../store/socketContext.jsx";
import uniqueID from "short-unique-id";
const uid = new uniqueID({ length: 10 });
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  createRect,
  createCircle,
  createLine,
  createPath,
  createText,
} from "./Shapes.jsx";
import {
  FaArrowRightLong,
  FaPen,
  FaRegCircle,
  FaRegSquare,
} from "react-icons/fa6";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { IoText } from "react-icons/io5";
import ColorPicker from "./ColorPicker.jsx";
import useWindowSize from "./UseWindowSize.jsx";
import { Label } from "./ui/label.jsx";
import { Input } from "./ui/input.jsx";
import { joinRoom } from "@/config/socketInstance.js";

export default function AdvancedWhiteboard() {
  let { canvas, canvasRef, setCanvas } = useCanvas();
  const windowSize = useWindowSize();
  const socket = useContext(socketContext);
  const navigate = useNavigate();
  const [activeShape, setActiveShape] = useState("cursor");
  const [color, setColor] = useState("#fff");
  const [openShare, setOpenShare] = useState(false);

  const [roomUrl, setRoomUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  let { id } = useParams();
  const [roomId, setRoomId] = useState(id || "");

  const activeShapeArr = [
    {
      icon: <BsCursorFill />,
      name: "cursor",
    },
    {
      icon: <FaPen />,
      name: "pencil",
    },
    {
      icon: <FaRegSquare />,
      name: "square",
    },
    {
      icon: <FaRegCircle />,
      name: "circle",
    },
    {
      icon: <TfiLayoutLineSolid />,
      name: "line",
    },
    {
      icon: <FaArrowRightLong />,
      name: "arrow",
    },
    {
      icon: <IoText />,
      name: "text",
    },
  ];

  useEffect(() => {
    if (roomId == "") {
      const newId = uid.rnd(20);
      setRoomId(newId);
      setRoomUrl(`${import.meta.env.VITE_FRONTEND_URL}/room/${newId}`);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
      console.log("1st ", id);
      setRoomId(id);
      setRoomUrl(`${import.meta.env.VITE_FRONTEND_URL}/room/${id}`);
      socket.connect();
      setIsConnected(true);
      joinRoom(roomId);
      navigate(`/room/${roomId}`);
    }
  }, []);

  const createRoom = () => {
    socket.connect();
    setIsConnected(true);
    joinRoom(roomId);
    navigate(`/room/${roomId}`);
  };
  const closeRoom = () => {
    socket.disconnect();
    setIsConnected(false);
    setRoomUrl("");
    navigate(`/`);
  };

  // FABRIC EVENTS
  useEffect(() => {
    if (canvas) {
      canvas.selection = true;
      canvas.on("object:modified", (e) =>
        modifyCanvasData(e, canvas, socket, roomId)
      );
      canvas.on("object:moving", (e) => {
        movedCanvas(e, canvas, socket, roomId);
      });
      canvas.on("object:scaling", (e) =>
        scaledCanvas(e, canvas, socket, roomId)
      );
      canvas.on("object:rotating", (e) =>
        rotateCanvas(e, canvas, socket, roomId)
      );
      canvas.on("selection:updated", (e) =>
        updateCanvas(e, canvas, socket, roomId)
      );
      canvas.on("selection:created", (e) =>
        selectedCanvas(e, canvas, socket, roomId)
      );
      return () => {
        canvas.dispose();
      };
    }
  }, [canvas]);

  // CHANGE COLOR OF BRUSH
  useEffect(() => {
    if (canvas && activeShape === "pencil") {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = color;
    }
  }, [color, activeShape, canvas]);

  // CHANGE DRAWING MODE
  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = activeShape === "pencil";
    }
  }, [activeShape, canvas]);

  // SHAPE FROM SOCKET
  // SocketEventHandler({ canvas, socket, color });

  // ADD SHAPE TO CANVAS
  const addShape = (shapeType) => {
    if (!canvas) return;
    const id = uid.rnd();
    let shape;
    switch (shapeType) {
      case "square":
        shape = createRect(id, color);
        break;
      case "circle":
        shape = createCircle(id, color);
        break;
      case "line":
        shape = createLine(id, color);
        break;
      case "arrow":
        shape = createPath(id, color);
        break;
      case "text":
        shape = createText(id, color);
        break;
    }

    addId(shape);

    if (shape) {
      socket && socket.emit("newShape", { shape, roomId });
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  };

  // CLEAR CANVAS
  const clearCanvas = () => {
    if (canvas) {
      let objs = [];
      canvas.getActiveObjects().forEach((element) => {
        objs.push(element.id);
        canvas.remove(element);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
      socket && clearSelection(canvas, socket, objs, roomId);
    }
  };

  const handleShapeClick = (shape) => {
    setActiveShape(shape);
  };

  return (
    <>
      <div className="w-screen h-screen items-center  top-0 flex flex-col space-y-4 p-4">
        <div className="w-screen h-screen border border-gray-600 par ent overflow-scroll">
          <canvas
            ref={canvasRef}
            className="border border-gray-600 rounded-xl"
          />
        </div>
        <div
          className={`text-white borde r border-red-700 fixed top-0 rounded flex ${
            windowSize.width <= 700 && "flex-col gap-2"
          } space-x-4 items-center`}
        >
          <div className="flex gap-1 px-2 py-2 border border-gray-700 rounded-xl">
            {activeShapeArr.map((shape) => (
              <div
                id={shape.name}
                onClick={(e) => {
                  handleShapeClick(e.currentTarget.id);
                }}
                key={shape.name}
                className={`${
                  activeShape === shape.name && "bg-[#212121]"
                } p-3 rounded-xl`}
              >
                {shape.icon}
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center justify-center">
            <ColorPicker setColor={setColor} />
            <div className="flex gap-2 items-center justify-center">
              <Button
                className="border border-gray-600 text-gray-300 rounded-xl"
                onClick={() => addShape(activeShape)}
                disabled={activeShape === "pencil" || activeShape === "cursor"}
              >
                Add Shape
              </Button>
              <Button
                className="border border-gray-700 text-gray-300 rounded-xl"
                onClick={clearCanvas}
                // variant="destructive"
              >
                <Trash2 className="mr h-4 w-4" />
              </Button>
              <br />

              {isConnected ? (
                <Button
                  onClick={closeRoom}
                  className="border border-gray-700 text-gray-300 rounded-xl"
                >
                  Stop Session
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setOpenShare(true);
                    createRoom();
                  }}
                  className="border border-gray-700 text-gray-300 rounded-xl"
                >
                  Share
                </Button>
              )}

              <Dialog open={openShare} onOpenChange={setOpenShare}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent
                  onInteractOutside={() => setOpenShare(false)}
                  className="sm:max-w-[425px] border bg rounded-xl"
                >
                  <DialogHeader>
                    <DialogTitle>Share Board</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        readOnly
                        id="name"
                        value={roomUrl}
                        className="col-span-3 border border-gray-700  rounded-xl"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      className="border text-gray-300 rounded-xl"
                      type="submit"
                    >
                      Copy URL
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <SocketEventHandler canvas={canvas} />
    </>
  );
}
