import { useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBInput, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import axiosInstance from '../utils/axiosInstance';
import Toast from '../components/Toast';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setToast({ show: true, message: 'Vui lòng nhập đầy đủ thông tin', color: 'danger' });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setToast({ show: true, message: 'Email không hợp lệ', color: 'danger' });
      return;
    }
    if (password.length < 6) {
      setToast({ show: true, message: 'Mật khẩu tối thiểu 6 ký tự', color: 'danger' });
      return;
    }
    setLoading(true);
    setToast({ show: false, message: '', color: 'success' });
    setSuccess(false);
    try {
      await axiosInstance.post('/auth/signup', { name, email, password });
      setSuccess(true);
      setToast({ show: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.', color: 'success' });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Đăng ký thất bại', color: 'danger' });
    }
    setLoading(false);
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard style={{ minWidth: '320px', maxWidth: '400px' }}>
        <MDBCardBody>
          <MDBCardTitle className="text-center mb-3">Đăng ký</MDBCardTitle>
          <form onSubmit={handleSubmit}>
            <MDBInput label="Tên" type="text" value={name} onChange={e => setName(e.target.value)} required className="mb-3" autoFocus />
            <MDBInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mb-3" />
            <MDBInput label="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mb-3" />
            <MDBBtn type="submit" className="w-100" disabled={loading}>
              {loading ? <MDBSpinner size="sm" grow /> : 'Đăng ký'}
            </MDBBtn>
          </form>
          {success && <div className="text-success mt-3">Vui lòng kiểm tra email để xác thực tài khoản!</div>}
        </MDBCardBody>
      </MDBCard>
      <Toast show={toast.show} message={toast.message} color={toast.color} onClose={() => setToast({ ...toast, show: false })} />
    </MDBContainer>
  );
}

export default SignUp; 