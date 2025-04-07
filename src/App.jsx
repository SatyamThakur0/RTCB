import AdvancedWhiteboard from "./components/AdvanceWhiteboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import SocketEventHandler from "./components/SocketEventHandler";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AdvancedWhiteboard />} />
                    <Route path="/room/:id" element={<AdvancedWhiteboard />} />
                </Routes>
            </BrowserRouter>
            
        </>
    );
}

export default App;
