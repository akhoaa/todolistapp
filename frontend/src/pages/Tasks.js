import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import MainLayout from '../layouts/MainLayout';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBInput, MDBSpinner, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter } from 'mdb-react-ui-kit';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [adding, setAdding] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    axiosInstance.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => navigate('/signin'));
  }, [navigate]);

  const fetchTasks = () => {
    setLoading(true);
    axiosInstance.get('/tasks')
      .then(res => setTasks(Array.isArray(res.data.data?.data) ? res.data.data.data : []))
      .catch(() => setError('Không thể tải danh sách task'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) return;
    fetchTasks();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setToast({ show: true, message: 'Tên task không được để trống', color: 'danger' });
      return;
    }
    if (!newDate) {
      setToast({ show: true, message: 'Vui lòng chọn ngày', color: 'danger' });
      return;
    }
    if (newDate < today) {
      setToast({ show: true, message: 'Ngày không được nhỏ hơn hôm nay', color: 'danger' });
      return;
    }
    setAdding(true);
    try {
      await axiosInstance.post('/tasks', { title: newTask, date: newDate });
      setNewTask('');
      setNewDate('');
      fetchTasks();
      setToast({ show: true, message: 'Thêm task thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể thêm task', color: 'danger' });
    }
    setAdding(false);
  };

  // Sửa task
  const openEditModal = (task) => {
    setEditTask(task);
    setEditValue(task.title);
    setEditDate(task.date || today);
    setEditModal(true);
  };
  const handleEditTask = async () => {
    if (!editValue.trim()) {
      setToast({ show: true, message: 'Tên task không được để trống', color: 'danger' });
      return;
    }
    if (!editDate) {
      setToast({ show: true, message: 'Vui lòng chọn ngày', color: 'danger' });
      return;
    }
    if (editDate < today) {
      setToast({ show: true, message: 'Ngày không được nhỏ hơn hôm nay', color: 'danger' });
      return;
    }
    setEditLoading(true);
    try {
      await axiosInstance.put(`/tasks/${editTask._id}`, { title: editValue, date: editDate });
      setEditModal(false);
      fetchTasks();
      setToast({ show: true, message: 'Sửa task thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể sửa task', color: 'danger' });
    }
    setEditLoading(false);
  };

  // Xóa task
  const openDeleteModal = (task) => {
    setDeleteTask(task);
    setDeleteModal(true);
  };
  const handleDeleteTask = async () => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/tasks/${deleteTask._id}`);
      setDeleteModal(false);
      fetchTasks();
      setToast({ show: true, message: 'Xóa task thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể xóa task', color: 'danger' });
    }
    setDeleteLoading(false);
  };

  // Toggle trạng thái completed
  const handleToggleCompleted = async (task) => {
    try {
      await axiosInstance.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
      setToast({ show: true, message: 'Cập nhật trạng thái thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể cập nhật trạng thái', color: 'danger' });
    }
  };

  // Thay thế Toast bằng Alert
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <MainLayout user={user} onLogout={() => { navigate('/signin'); }}>
      <h2>Quản lý Task</h2>
      <form className="d-flex mb-4 align-items-end" onSubmit={handleAddTask}>
        <MDBInput
          label="Tên task mới"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          className="me-2"
        />
        <div className="me-2">
          <label className="form-label">Ngày</label>
          <input type="date" className="form-control" value={newDate} min={today} onChange={e => setNewDate(e.target.value)} required />
        </div>
        <MDBBtn type="submit" disabled={adding}>{adding ? <MDBSpinner size="sm" grow /> : 'Thêm task'}</MDBBtn>
      </form>
      {loading ? (
        <MDBSpinner color="primary" grow />
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <MDBTable hover>
          <MDBTableHead>
            <tr>
              <th>#</th>
              <th>Tên task</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {(Array.isArray(tasks) ? tasks : []).map((task, idx) => (
              <tr key={task._id || idx}>
                <td>{idx + 1}</td>
                <td>{task.title}</td>
                <td>{task.date}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task)}
                    label={task.completed ? 'Hoàn thành' : 'Chưa xong'}
                  />
                </td>
                <td>
                  {/* Chỉ admin hoặc chủ sở hữu task mới được sửa/xóa */}
                  {(user?.role === 'admin' || user?._id === task.user) && (
                    <>
                      <MDBBtn size="sm" color="warning" className="me-2" onClick={() => openEditModal(task)}>Sửa</MDBBtn>
                      <MDBBtn color="danger" onClick={() => openDeleteModal(task)} size="sm">Xóa</MDBBtn>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      )}

      {/* Modal sửa task */}
      <MDBModal open={editModal} setOpen={setEditModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Sửa task</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setEditModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Tên task"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                autoFocus
                className="mb-3"
              />
              <label className="form-label">Ngày</label>
              <input type="date" className="form-control" value={editDate} min={today} onChange={e => setEditDate(e.target.value)} required />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setEditModal(false)}>Hủy</MDBBtn>
              <MDBBtn color='primary' onClick={handleEditTask} disabled={editLoading}>
                {editLoading ? <MDBSpinner size="sm" grow /> : 'Lưu'}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Modal xác nhận xóa task */}
      <MDBModal open={deleteModal} setOpen={setDeleteModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Xác nhận xóa</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setDeleteModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Bạn có chắc chắn muốn xóa task "{deleteTask?.title}" không?
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setDeleteModal(false)}>Hủy</MDBBtn>
              <MDBBtn color='danger' onClick={handleDeleteTask} disabled={deleteLoading}>
                {deleteLoading ? <MDBSpinner size="sm" grow /> : 'Xóa'}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Alert thông báo */}
      {toast.show && (
        <Alert variant={toast.color === 'danger' ? 'danger' : 'success'} className="position-fixed top-0 end-0 m-3" style={{ zIndex: 9999, minWidth: 250 }} dismissible onClose={() => setToast({ ...toast, show: false })}>
          <strong>{toast.color === 'success' ? 'Thành công' : 'Lỗi'}: </strong>{toast.message}
        </Alert>
      )}
    </MainLayout>
  );
}

export default Tasks; 