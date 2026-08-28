import { BrowserRouter, useLocation } from "react-router-dom";
import MeetingPage from "./pages/MeetingPage";
import AdminPage from "./pages/AdminPage";
import Header from "./components/Header/Header";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdmin = new URLSearchParams(location.search).get("admin") === "true";

  return (
    <>
      <Header />
      {isAdmin ? <AdminPage /> : <MeetingPage />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;