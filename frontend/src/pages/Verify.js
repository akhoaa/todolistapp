import { useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBInput, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import axiosInstance from '../utils/axiosInstance';
import Toast from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';

function Verify() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) {
      setToast({ show: true, message: 'Vui lòng nhập email và OTP', color: 'danger' });
      return;
    }
    setLoading(true);
    setToast({ show: false, message: '', color: 'success' });
    setSuccess(false);
    try {
      await axiosInstance.post('/auth/verify', { email, otp });
      setSuccess(true);
      setToast({ show: true, message: 'Xác thực thành công! Bạn có thể đăng nhập.', color: 'success' });
      setTimeout(() => navigate('/signin'), 1200);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Xác thực thất bại', color: 'danger' });
    }
    setLoading(false);
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard style={{ minWidth: '320px', maxWidth: '400px' }}>
        <MDBCardBody>
          <MDBCardTitle className="text-center mb-3">Xác thực tài khoản</MDBCardTitle>
          <form onSubmit={handleSubmit}>
            <MDBInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mb-3" autoFocus />
            <MDBInput label="OTP" type="text" value={otp} onChange={e => setOtp(e.target.value)} required className="mb-3" />
            <MDBBtn type="submit" className="w-100" disabled={loading}>
              {loading ? <MDBSpinner size="sm" grow /> : 'Xác thực'}
            </MDBBtn>
          </form>
          {success && <div className="text-success mt-3">Xác thực thành công! Bạn có thể <Link to="/signin">đăng nhập</Link>.</div>}
        </MDBCardBody>
      </MDBCard>
      <Toast show={toast.show} message={toast.message} color={toast.color} onClose={() => setToast({ ...toast, show: false })} />
    </MDBContainer>
  );
}

export default Verify; 