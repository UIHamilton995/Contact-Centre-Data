import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmailDashboard from "./pages/EmailDashboard";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<EmailDashboard />} />
      </Routes>
    </Router>    
  )
}

export default App
