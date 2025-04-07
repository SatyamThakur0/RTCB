import socket from "../src/config/socketInstance";
import { createContext, useState, useContext } from "react";
export const socketContext = createContext();

const SocketProvider = ({ children }) => {
    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
};

export default SocketProvider;
