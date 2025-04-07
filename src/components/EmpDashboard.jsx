"use client";
import { TaskStats } from "./Tasks/TaskStats";
import Navbar from "./Navbar";
import TaskList from "./Tasks/TaskList";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric"; // v6
// import { fabric } from "fabric"; // v5

function EmpDashboard() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    useEffect(() => {
        // const options = { ... };
        const canvasI = new fabric.Canvas(canvasRef.current);
        // make the fabric.Canvas instance available to your app
        setCanvas(canvasI);
        canvas.isDrawingMode = true;

        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = "#000";
        canvas.freeDrawingBrush.width = 5;
        const rect = new fabric.Rect({
            top: 50,
            left: 50,
            width: 500,
            height: 500,
            fill: "red",
        });
        canvas.add(rect);
        // updateCanvasContext(canvas);
        return () => {
            canvas.dispose();
        };
    }, []);

    return (
        <div className="parent flex flex-col">
            <Navbar />
            <TaskStats />
            <TaskList />
            <canvas
                className=" text-black bg-white"
                width="600"
                height="400"
                ref={canvasRef}
                style={{ border: "1px solid black" }}
            />
        </div>
    );
}

export default EmpDashboard;
