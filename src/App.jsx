import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/main/Homepage'
import Login from './pages/main/Login/Login'
import Template from './pages/Template'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/template" element={<Template />} />
      </Routes>
    </Router>
  );
}

export default App;