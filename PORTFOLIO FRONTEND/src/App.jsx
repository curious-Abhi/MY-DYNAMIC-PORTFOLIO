
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Home  from "./pages/Home"
import Footer from "./pages/Footer";
import ProjectView from "./pages/ProjectView";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import './customStyles.css';
function App() {


  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle/>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/project/:id" element={<ProjectView/>}/>
          </Routes>
          <Footer/>
          <ToastContainer position="bottom-right" theme="dark"/>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
