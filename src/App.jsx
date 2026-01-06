import React from "react";
import Chat from "./component/Chat";
import LandingPage from "./component/LandingPage";
import Login from "./component/Login";
import { Routes, Route } from "react-router";
import Signup from "./component/Signup";

function App() {
  return (
    <div>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatapp" element={<Chat />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
