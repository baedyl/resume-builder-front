import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ResumeForm from './components/ResumeForm';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import Callback from './components/Callback';
import ResumeBuilder from './pages/ResumeBuilder';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Show a loading state while Auth0 checks authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

console.log('isAuthenticated:', isAuthenticated);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/my-resumes" /> : <Home />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/resume"
          element={isAuthenticated ? <ResumeForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-resumes"
          element={isAuthenticated ? <ResumeBuilder /> : <Navigate to="/login" />}
        />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;