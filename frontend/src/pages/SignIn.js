import { useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBInput, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setToast({ show: true, message: 'Vui lòng nhập email và mật khẩu', color: 'danger' });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setToast({ show: true, message: 'Email không hợp lệ', color: 'danger' });
      return;
    }
    setLoading(true);
    setToast({ show: false, message: '', color: 'success' });
    try {
      await axiosInstance.post('/auth/signin', { email, password });
      const res = await axiosInstance.get('/auth/me');
      login(res.data);
      setToast({ show: true, message: 'Đăng nhập thành công!', color: 'success' });
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Đăng nhập thất bại', color: 'danger' });
    }
    setLoading(false);
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard style={{ minWidth: 350 }}>
        <MDBCardBody>
          <MDBCardTitle className="text-center mb-4">Đăng nhập</MDBCardTitle>
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-3"
              required
              autoFocus
            />
            <MDBInput
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mb-3"
              required
              autoComplete="current-password"
            />
            <MDBBtn type="submit" className="w-100 mb-2" disabled={loading}>
              {loading ? <MDBSpinner size="sm" grow /> : 'ĐĂNG NHẬP'}
            </MDBBtn>
          </form>
          <div className="d-flex justify-content-between mt-3" style={{ fontSize: '0.95rem' }}>
            <Link to="/signup">Đăng ký tài khoản</Link>
            <Link to="/forgot">Quên mật khẩu?</Link>
          </div>
        </MDBCardBody>
      </MDBCard>
      <Toast show={toast.show} message={toast.message} color={toast.color} onClose={() => setToast({ ...toast, show: false })} />
    </MDBContainer>
  );
}

export default SignIn; 