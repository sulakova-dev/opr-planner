import { BrowserRouter, Routes, Route } from "react-router-dom";

import MeetingPage from "./pages/MeetingPage";
import AdminPage from "./pages/AdminPage";

import Header from "./components/Header/Header";

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<MeetingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
