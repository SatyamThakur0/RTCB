"use client";
import React, { useState, useEffect } from "react";

const useWindowSize = () => {
    // State to store the window dimensions
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // Handler to update state on window resize
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };

            // Add event listener for resizing the window
            window.addEventListener("resize", handleResize);

            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    return windowSize;
};

export default useWindowSize;
