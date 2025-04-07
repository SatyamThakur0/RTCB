"use client";

import { useEffect, useState } from "react";

export default function ColorPicker({ setColor }) {
    const [selectedColor, setSelectedColor] = useState(0);

    const colors = [
        { id: 0, bg: "bg-[#ffffff]", color: "#ffffff" },
        { id: 1, bg: "bg-[#ff7e7e]", color: "#ff7e7e" },
        { id: 2, bg: "bg-[#4CAF50]", color: "#4CAF50" },
        { id: 3, bg: "bg-[#2196F3]", color: "#2196F3" },
        { id: 4, bg: "bg-[#b35f00]", color: "#b35f00" },
    ];

    useEffect(() => {
        setColor(colors[selectedColor].color);
        // console.log(colors[selectedColor].color);
    }, [selectedColor]);

    return (
        <div className="py-3 px-3 bg-[#121212] border border-gray-600 text-gray-300 rounded-xl">
            <div className="flex gap-2">
                {colors.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`w-6 h-6 rounded-2xl transition-transform ${
                            color.bg
                        } ${
                            selectedColor === color.id
                                ? "ring-1 ring-gray-400 ring-offset-2 ring-offset-zinc-900 scale-110"
                                : "hover:scale-105"
                        }`}
                        aria-label={`Select color ${color.id + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
