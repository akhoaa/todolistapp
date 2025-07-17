import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import MainLayout from '../layouts/MainLayout';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBInput, MDBSpinner, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter } from 'mdb-react-ui-kit';
import Toast from '../components/Toast';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [newProject, setNewProject] = useState('');
  const [adding, setAdding] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteProject, setDeleteProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [users, setUsers] = useState([]);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [addMemberProject, setAddMemberProject] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [removeMemberProject, setRemoveMemberProject] = useState(null);
  const [removeMemberId, setRemoveMemberId] = useState('');
  const [removeMemberModal, setRemoveMemberModal] = useState(false);
  const [removeMemberLoading, setRemoveMemberLoading] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    axiosInstance.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => navigate('/signin'));
    // Lấy danh sách user để map id sang tên
    axiosInstance.get('/users')
      .then(res => setUsers(Array.isArray(res.data.data) ? res.data.data : []));
  }, [navigate]);

  const fetchProjects = () => {
    setLoading(true);
    axiosInstance.get('/projects')
      .then(res => setProjects(Array.isArray(res.data.data) ? res.data.data : []))
      .catch(() => setError('Không thể tải danh sách project'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.trim()) {
      setToast({ show: true, message: 'Tên project không được để trống', color: 'danger' });
      return;
    }
    setAdding(true);
    try {
      await axiosInstance.post('/projects', { name: newProject });
      setNewProject('');
      fetchProjects();
      setToast({ show: true, message: 'Thêm project thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể thêm project', color: 'danger' });
    }
    setAdding(false);
  };

  // Sửa project
  const openEditModal = (project) => {
    setEditProject(project);
    setEditValue(project.name);
    setEditModal(true);
  };
  const handleEditProject = async () => {
    if (!editValue.trim()) {
      setToast({ show: true, message: 'Tên project không được để trống', color: 'danger' });
      return;
    }
    setEditLoading(true);
    try {
      await axiosInstance.put(`/projects/${editProject._id}`, { name: editValue });
      setEditModal(false);
      fetchProjects();
      setToast({ show: true, message: 'Sửa project thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể sửa project', color: 'danger' });
    }
    setEditLoading(false);
  };

  // Xóa project
  const openDeleteModal = (project) => {
    setDeleteProject(project);
    setDeleteModal(true);
  };
  const handleDeleteProject = async () => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/projects/${deleteProject._id}`);
      setDeleteModal(false);
      fetchProjects();
      setToast({ show: true, message: 'Xóa project thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể xóa project', color: 'danger' });
    }
    setDeleteLoading(false);
  };

  // Thêm thành viên
  const openAddMemberModal = (project) => {
    setAddMemberProject(project);
    setSelectedUserId('');
    setAddMemberModal(true);
  };
  const handleAddMember = async () => {
    if (!selectedUserId) {
      setToast({ show: true, message: 'Vui lòng chọn user', color: 'danger' });
      return;
    }
    setAddMemberLoading(true);
    try {
      await axiosInstance.post(`/projects/${addMemberProject._id}/members`, { userId: selectedUserId });
      setAddMemberModal(false);
      fetchProjects();
      setToast({ show: true, message: 'Thêm thành viên thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể thêm thành viên', color: 'danger' });
    }
    setAddMemberLoading(false);
  };
  // Xóa thành viên
  const openRemoveMemberModal = (project, userId) => {
    setRemoveMemberProject(project);
    setRemoveMemberId(userId);
    setRemoveMemberModal(true);
  };
  const handleRemoveMember = async () => {
    setRemoveMemberLoading(true);
    try {
      await axiosInstance.delete(`/projects/${removeMemberProject._id}/members/${removeMemberId}`);
      setRemoveMemberModal(false);
      fetchProjects();
      setToast({ show: true, message: 'Xóa thành viên thành công', color: 'success' });
    } catch {
      setToast({ show: true, message: 'Không thể xóa thành viên', color: 'danger' });
    }
    setRemoveMemberLoading(false);
  };

  return (
    <MainLayout user={user} onLogout={() => { navigate('/signin'); }}>
      <h2>Quản lý Project</h2>
      <form className="d-flex mb-4" onSubmit={handleAddProject}>
        <MDBInput
          label="Tên project mới"
          value={newProject}
          onChange={e => setNewProject(e.target.value)}
          className="me-2"
        />
        <MDBBtn type="submit" disabled={adding}>{adding ? <MDBSpinner size="sm" grow /> : 'Thêm project'}</MDBBtn>
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
              <th>Tên project</th>
              <th>Thành viên</th>
              <th>Hành động</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {(Array.isArray(projects) ? projects : []).map((project, idx) => (
              <tr key={project._id || idx}>
                <td>{idx + 1}</td>
                <td>{project.name}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {(project.members || []).map((memberId, i) => {
                      const member = users.find(u => u._id === memberId);
                      return (
                        <div key={memberId} style={{ display: 'flex', alignItems: 'center' }}>
                          <span>{member ? member.name : memberId}</span>
                          {/* Chỉ owner hoặc admin mới được xóa thành viên */}
                          {(currentUser?.role === 'admin' || currentUser?._id === project.owner) && (
                            <MDBBtn size="sm" color="danger" className="ms-2" onClick={() => openRemoveMemberModal(project, memberId)}>
                              XÓA
                            </MDBBtn>
                          )}
                        </div>
                      );
                    })}
                    {/* Chỉ owner hoặc admin mới được thêm thành viên */}
                    {(currentUser?.role === 'admin' || currentUser?._id === project.owner) && (
                      <MDBBtn size="sm" color="info" className="mt-2" onClick={() => openAddMemberModal(project)}>
                        THÊM
                      </MDBBtn>
                    )}
                  </div>
                </td>
                <td>
                  {/* Chỉ owner hoặc admin mới được sửa/xóa project */}
                  {(currentUser?.role === 'admin' || currentUser?._id === project.owner) && (
                    <>
                      <MDBBtn size="sm" color="warning" className="me-2" onClick={() => openEditModal(project)}>Sửa</MDBBtn>
                      <MDBBtn color="danger" onClick={() => openDeleteModal(project)} size="sm">Xóa</MDBBtn>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      )}

      {/* Modal sửa project */}
      <MDBModal open={editModal} setOpen={setEditModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Sửa project</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setEditModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Tên project"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                autoFocus
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setEditModal(false)}>Hủy</MDBBtn>
              <MDBBtn color='primary' onClick={handleEditProject} disabled={editLoading}>
                {editLoading ? <MDBSpinner size="sm" grow /> : 'Lưu'}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Modal xác nhận xóa project */}
      <MDBModal open={deleteModal} setOpen={setDeleteModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Xác nhận xóa</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setDeleteModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Bạn có chắc chắn muốn xóa project "{deleteProject?.name}" không?
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setDeleteModal(false)}>Hủy</MDBBtn>
              <MDBBtn color='danger' onClick={handleDeleteProject} disabled={deleteLoading}>
                {deleteLoading ? <MDBSpinner size="sm" grow /> : 'Xóa'}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Modal thêm thành viên */}
      <MDBModal open={addMemberModal} setOpen={setAddMemberModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Thêm thành viên</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setAddMemberModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Form.Select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                <option value=''>-- Chọn user --</option>
                {users.filter(u => !(addMemberProject?.members || []).includes(u._id)).map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </Form.Select>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setAddMemberModal(false)}>Hủy</MDBBtn>
              <MDBBtn color='primary' onClick={handleAddMember} disabled={addMemberLoading}>
                {addMemberLoading ? <MDBSpinner size="sm" grow /> : 'Thêm'}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      {/* Modal xác nhận xóa thành viên */}
      <MDBModal open={removeMemberModal} setOpen={setRemoveMemberModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Xác nhận xóa thành viên</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setRemoveMemberModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Bạn có chắc chắn muốn xóa thành viên này khỏi project không?
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setRemoveMemberModal(false)}>Hủy</MDBBtn>
              <MDBBtn color='danger' onClick={handleRemoveMember} disabled={removeMemberLoading}>
                {removeMemberLoading ? <MDBSpinner size="sm" grow /> : 'Xóa'}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Alert thông báo */}
      {toast.show && (
        <Toast show={toast.show} message={toast.message} color={toast.color} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </MainLayout>
  );
}

export default Projects; 