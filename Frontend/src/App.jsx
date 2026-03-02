import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Formats from "./pages/Formats";
import About from "./pages/About";

function App() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/formats' element={<Formats />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
