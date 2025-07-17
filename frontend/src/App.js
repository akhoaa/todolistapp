import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Admin from './pages/Admin';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Verify from './pages/Verify';
import Forgot from './pages/Forgot';
import RequireLogin from './components/RequireLogin';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/" element={<RequireLogin><Dashboard /></RequireLogin>} />
        <Route path="/projects" element={<RequireLogin><Projects /></RequireLogin>} />
        <Route path="/tasks" element={<RequireLogin><Tasks /></RequireLogin>} />
        <Route path="/admin" element={<RequireLogin>{user && user.role === 'admin' ? <Admin /> : <Navigate to="/" />}</RequireLogin>} />
        {/* Thêm các route khác cần bảo vệ ở đây */}
      </Routes>
    </Router>
  );
}

export default App;
