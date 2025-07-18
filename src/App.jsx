import Template from './pages/Template'
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
      <Template />
      </div>
    </Router>
  );
}

export default App;
