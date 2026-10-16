import "./App.css";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent.jsx";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <MainContent />
    </div>
  );
}
