import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import MainLayout from '../layouts/MainLayout';
import { MDBTable, MDBTableHead, MDBTableBody, MDBSpinner, MDBBtn, MDBIcon, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Admin() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  // Thêm các state cho modal và xử lý user
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit' | 'add'
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', password: '' });
  const [modalError, setModalError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [report, setReport] = useState({ tasks: null, users: null });
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  if (!authUser || authUser.role !== 'admin') return <div className="text-danger text-center py-5">Bạn không có quyền truy cập trang này.</div>;

  useEffect(() => {
    // Debug: log khi lấy user
    axiosInstance.get('/auth/me')
      .then(res => {
        console.log('auth/me response:', res.data);
        setUser(res.data);
        if (res.data.role !== 'admin') {
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        console.log('auth/me error:', err);
        navigate('/signin');
      });
  }, [navigate]);

  useEffect(() => {
    console.log('Current user:', user);
    if (!user || user.role !== 'admin') return;
    console.log('Fetching users...');
    setLoading(true);
    axiosInstance.get('/admin/users')
      .then(res => {
        console.log('admin/users response:', res.data);
        setUsers(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.log('admin/users error:', err);
        setError('Không thể tải danh sách user');
      })
      .finally(() => setLoading(false));
  }, [user, deleteSuccess]);

  // Báo cáo
  useEffect(() => {
    if (activeTab !== 'reports' || !user || user.role !== 'admin') return;
    setReportLoading(true);
    Promise.all([
      axiosInstance.get('/admin/report/tasks'),
      axiosInstance.get('/admin/report/users')
    ])
      .then(([tasks, users]) => setReport({ tasks: tasks.data, users: users.data }))
      .catch(() => setReportError('Không thể tải báo cáo'))
      .finally(() => setReportLoading(false));
  }, [activeTab, user]);

  const openModal = (mode, u) => {
    setModalMode(mode);
    setSelectedUser(u);
    setEditForm({ name: u.name, email: u.email, role: u.role });
    setModalError('');
    setShowModal(true);
  };

  // Thêm các hàm xử lý cho modal
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setModalError('');
    console.log('Submit sửa user:', selectedUser, editForm);
    try {
      await axiosInstance.put(`/admin/user/${selectedUser._id}`, editForm);
      setShowModal(false);
      setSelectedUser(null);
      setEditForm({ name: '', email: '', role: '', password: '' });
      setTimeout(() => setDeleteSuccess('Cập nhật user thành công!'), 100);
    } catch (err) {
      setModalError('Cập nhật thất bại');
    }
  };

  const handleDelete = async () => {
    setDeleteError('');
    console.log('Submit xóa user:', deleteUser);
    try {
      await axiosInstance.delete(`/admin/user/${deleteUser._id}`);
      setShowDelete(false);
      setDeleteUser(null);
      setDeleteSuccess('Xóa user thành công!');
      setTimeout(() => setDeleteSuccess(''), 2000);
    } catch (err) {
      setDeleteError('Xóa thất bại');
    }
  };

  const handleAddUser = async e => {
    e.preventDefault();
    setModalError('');
    try {
      await axiosInstance.post('/admin/user', editForm);
      setShowModal(false);
      setEditForm({ name: '', email: '', role: '', password: '' });
      setTimeout(() => setDeleteSuccess('Tạo user thành công!'), 100);
    } catch (err) {
      setModalError('Tạo user thất bại');
    }
  };

  const handleLogout = async () => {
    // Nếu có API /auth/signout thì có thể gọi ở đây
    navigate('/signin');
  };

  return (
    <>
      <MDBModal show={true} setShow={() => {}} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Test Modal</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              Hello World
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MainLayout user={user} onLogout={handleLogout}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h2>Quản lý User</h2>
          <MDBBtn color='primary' onClick={() => { setModalMode('add'); setSelectedUser(null); setEditForm({ name: '', email: '', role: '', password: '' }); setModalError(''); setShowModal(true); }}>Thêm user</MDBBtn>
        </div>
        {loading ? (
          <MDBSpinner color="primary" grow />
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <table border="1" style={{width:'100%',background:'#fff',marginBottom:24}}>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Role</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(users) ? users : []).map((u, idx) => (
                <tr key={u._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {/* Chỉ admin mới được sửa/xóa user khác, không cho phép xóa chính mình */}
                    {authUser?.role === 'admin' && authUser._id !== u._id && (
                      <>
                        <MDBBtn size="sm" color="info" className="me-1" onClick={() => { setSelectedUser(u); setModalMode('view'); setShowModal(true); }}><MDBIcon icon="eye" /></MDBBtn>
                        <MDBBtn size="sm" color="warning" className="me-1" onClick={() => { setSelectedUser(u); setEditForm({ name: u.name, email: u.email, role: u.role, password: '' }); setModalMode('edit'); setShowModal(true); }}><MDBIcon icon="edit" /></MDBBtn>
                        <MDBBtn size="sm" color="danger" onClick={() => { setDeleteUser(u); setShowDelete(true); }}><MDBIcon icon="trash" /></MDBBtn>
                      </>
                    )}
                    {/* Cho phép admin xem thông tin của chính mình */}
                    {authUser?._id === u._id && (
                      <MDBBtn size="sm" color="info" className="me-1" onClick={() => { setSelectedUser(u); setModalMode('view'); setShowModal(true); }}><MDBIcon icon="eye" /></MDBBtn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Modal Thêm/Sửa/Xem user */}
        <MDBModal show={showModal} setShow={setShowModal} tabIndex='-1'>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>
                  {modalMode === 'add' ? 'Thêm user' : modalMode === 'edit' ? 'Sửa user' : 'Xem user'}
                </MDBModalTitle>
                <MDBBtn type='button' className='btn-close' color='none' onClick={() => setShowModal(false)}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                {(modalMode === 'add' || modalMode === 'edit') ? (
                  <form onSubmit={modalMode === 'add' ? handleAddUser : handleEditSubmit}>
                    <MDBInput label='Tên' name='name' value={editForm.name} onChange={handleEditChange} className='mb-2' required />
                    <MDBInput label='Email' name='email' value={editForm.email} onChange={handleEditChange} className='mb-2' type='email' required />
                    <MDBInput label='Role' name='role' value={editForm.role} onChange={handleEditChange} className='mb-2' required />
                    {modalMode === 'add' && <MDBInput label='Password' name='password' value={editForm.password || ''} onChange={handleEditChange} className='mb-2' type='password' required />}
                    {modalError && <div className="alert alert-danger">{modalError}</div>}
                    <MDBBtn type='submit' color='primary'>{modalMode === 'add' ? 'Tạo mới' : 'Lưu'}</MDBBtn>
                  </form>
                ) : selectedUser && modalMode === 'view' ? (
                  <>
                    <div><b>Tên:</b> {selectedUser.name}</div>
                    <div><b>Email:</b> {selectedUser.email}</div>
                    <div><b>Role:</b> {selectedUser.role}</div>
                  </>
                ) : null}
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn type='button' color='secondary' onClick={() => setShowModal(false)}>Đóng</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
        {/* Modal xác nhận xóa user */}
        <MDBModal show={showDelete} setShow={setShowDelete} tabIndex='-1'>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Xác nhận xóa user</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={() => setShowDelete(false)}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                {deleteError && <div className="alert alert-danger">{deleteError}</div>}
                <div>Bạn có chắc chắn muốn xóa user <b>{deleteUser?.name}</b>?</div>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn type='button' color='secondary' onClick={() => setShowDelete(false)}>Hủy</MDBBtn>
                <MDBBtn type='button' color='danger' onClick={handleDelete}>Xóa</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
        {deleteSuccess && <div className="alert alert-success">{deleteSuccess}</div>}
        <h2>Báo cáo</h2>
        <pre>{JSON.stringify(report, null, 2)}</pre>
      </MainLayout>
    </>
  );
}

export default Admin; 