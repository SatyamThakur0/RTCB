"use client"
import * as fabric from "fabric";
export const createRect = (id, color) => {
    let shape = new fabric.Rect({
        width: 100,
        height: 100,
        fill: "transparent",
        stroke: color,
        strokeWidth: 2,
        left: 100,
        top: 100,
        id: id,
    });
    return shape;
};
export const createCircle = (id, color) => {
    let shape = new fabric.Circle({
        radius: 50,
        left: 100,
        top: 100,
        fill: "transparent",
        stroke: color,
        strokeWidth: 2,
        id: id,
    });
    return shape;
};
export const createLine = (id, color) => {
    let shape = new fabric.Line([50, 100, 200, 100], {
        stroke: color,
        id: id,
    });
    return shape;
};
export const createPath = (id, color) => {
    let shape = new fabric.Path("M 0 0 L 200 0 L 190 -10 M 200 0 L 190 10", {
        stroke: color,
        top: 100,
        left: 100,
        id: id,
        fill: "transparent",
    });
    return shape;
};
export const createText = (id, color) => {
    let shape = new fabric.IText("Type here", {
        left: 100,
        top: 100,
        fill: color,
        id: id,
    });
    return shape;
};
