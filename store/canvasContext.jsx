"use client";
import { createContext, useState, useEffect, useContext, useRef } from "react";
const canvasContext = createContext();
import * as fabric from "fabric";

const CanvasProvider = ({ children }) => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined" && canvasRef.current) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                width: window.innerWidth,
                height: window.innerHeight,
                isDrawingMode: true,
            });
            fabricCanvas.selection = true;
            setCanvas(fabricCanvas);

            return () => {
                fabricCanvas.dispose();
            };
        }
    }, [canvasRef]);

    return (
        <canvasContext.Provider value={{ canvas, canvasRef, setCanvas }}>
            {children}
        </canvasContext.Provider>
    );
};

export default CanvasProvider;

export const useCanvas = () => {
    return useContext(canvasContext);
};
