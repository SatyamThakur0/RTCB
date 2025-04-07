import { createSlice } from "@reduxjs/toolkit";

const canvasSlice = createSlice({
    name: "canvas",
    initialState: {
        selectedChat: null,
        onlineUsers: [],
        messages: [],
        loadingMessages: false,
    },
    reducers: {
        
    },
});

export const canvasAction = canvasSlice.actions;
export default canvasSlice;
