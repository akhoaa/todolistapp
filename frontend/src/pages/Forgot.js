import { useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBInput, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import axiosInstance from '../utils/axiosInstance';
import Toast from '../components/Toast';

function Forgot() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setToast({ show: true, message: 'Vui lòng nhập email', color: 'danger' });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setToast({ show: true, message: 'Email không hợp lệ', color: 'danger' });
      return;
    }
    setLoading(true);
    setToast({ show: false, message: '', color: 'success' });
    setSuccess(false);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setSuccess(true);
      setToast({ show: true, message: 'Đã gửi OTP về email! Vui lòng kiểm tra email để lấy mã OTP.', color: 'success' });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Gửi OTP thất bại', color: 'danger' });
    }
    setLoading(false);
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard style={{ minWidth: '320px', maxWidth: '400px' }}>
        <MDBCardBody>
          <MDBCardTitle className="text-center mb-3">Quên mật khẩu</MDBCardTitle>
          <form onSubmit={handleSubmit}>
            <MDBInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mb-3" autoFocus />
            <MDBBtn type="submit" className="w-100" disabled={loading}>
              {loading ? <MDBSpinner size="sm" grow /> : 'Gửi OTP'}
            </MDBBtn>
          </form>
          {success && <div className="text-success mt-3">Vui lòng kiểm tra email để lấy mã OTP và đặt lại mật khẩu.</div>}
        </MDBCardBody>
      </MDBCard>
      <Toast show={toast.show} message={toast.message} color={toast.color} onClose={() => setToast({ ...toast, show: false })} />
    </MDBContainer>
  );
}

export default Forgot; 