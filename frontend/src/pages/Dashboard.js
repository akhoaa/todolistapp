import { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon, MDBBadge, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/me', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Không thể lấy thông tin user. Vui lòng đăng nhập lại.');
        setLoading(false);
        setTimeout(() => navigate('/signin'), 1500);
      });
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    // Lấy số lượng project
    axios.get('http://localhost:3000/projects', { withCredentials: true })
      .then(res => setProjectCount(Array.isArray(res.data.data) ? res.data.data.length : 0));
    // Lấy số lượng task
    axios.get('http://localhost:3000/tasks', { withCredentials: true })
      .then(res => {
        const tasks = Array.isArray(res.data.data?.data) ? res.data.data.data : [];
        setTaskCount(tasks.length);
        setCompletedTaskCount(tasks.filter(t => t.completed).length);
      });
    // Nếu là admin, lấy tổng số user
    if (user.role === 'admin') {
      axios.get('http://localhost:3000/users', { withCredentials: true })
        .then(res => setUserCount(Array.isArray(res.data.data) ? res.data.data.length : 0));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
    } catch {}
    setUser(null);
    navigate('/signin');
  };

  if (loading) return <div className='text-center py-5'><MDBSpinner grow color="primary" /> Đang tải...</div>;
  if (error) return <div className='text-center text-danger py-5'>{error}</div>;

  // Avatar ký tự đầu tên
  const avatar = user?.name ? user.name[0].toUpperCase() : '?';
  const roleColor = user?.role === 'admin' ? 'danger' : 'primary';

  // Tạo mảng cards để auto render shortcut
  const cards = [
    {
      title: 'Dự án',
      count: projectCount,
      icon: 'folder',
      color: 'info',
      btnColor: 'info',
      btnText: 'XEM TẤT CẢ',
      onClick: () => navigate('/projects'),
      extra: null,
    },
    {
      title: 'Công việc',
      count: taskCount,
      icon: 'tasks',
      color: 'success',
      btnColor: 'success',
      btnText: 'XEM TẤT CẢ',
      onClick: () => navigate('/tasks'),
      extra: <div className="small text-muted">Hoàn thành: {completedTaskCount}</div>,
    },
  ];
  if (user.role === 'admin') {
    cards.push({
      title: 'Quản trị',
      count: userCount,
      icon: 'users',
      color: 'danger',
      btnColor: 'danger',
      btnText: 'QUẢN LÝ USER',
      onClick: () => navigate('/admin'),
      extra: null,
    });
  }

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {/* Avatar và info user ở trên, căn giữa */}
      <div className="text-center mb-4">
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto' }}>{avatar}</div>
        <h5 className="mt-3 mb-1">{user.name}</h5>
        <div className="mb-2 text-muted">{user.email}</div>
        <MDBBadge color={roleColor} pill>{user.role}</MDBBadge>
      </div>
      {/* Card shortcut full width, responsive, chia đều */}
      <MDBRow className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center mb-4">
        {cards.map(card => (
          <MDBCol key={card.title}>
            <MDBCard className="h-100 hover-shadow" onClick={card.onClick} style={{ cursor: 'pointer' }}>
              <MDBCardBody className="text-center">
                <MDBIcon icon={card.icon} size="2x" className={`mb-2 text-${card.color}`} />
                <div className="fw-bold">{card.title}</div>
                <h4 className="my-2">{card.count}</h4>
                {card.extra}
                <MDBBtn color={card.btnColor} size="sm" className="mt-2">{card.btnText}</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
      <div className="mt-4 text-center">
        <p className="lead">Chào mừng bạn đến với hệ thống quản lý công việc!<br />Hãy bắt đầu bằng cách chọn chức năng bên trên.</p>
      </div>
    </MainLayout>
  );
}

export default Dashboard; 