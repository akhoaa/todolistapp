import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MDBIcon, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';

function MainLayout({ onLogout, children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#f8f9fa', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1000 }}>
        <div className='d-flex align-items-center justify-content-center py-4 border-bottom'>
          <MDBIcon icon='tasks' className='me-2 text-primary' />
          <span className='fw-bold fs-5'>TodoApp</span>
        </div>
        <nav className='flex-grow-1'>
          <ul className='nav flex-column mt-3'>
            <li className='nav-item'>
              <Link className='nav-link' to='/'>
                <MDBIcon icon='tachometer-alt' className='me-2' /> Dashboard
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/projects'>
                <MDBIcon icon='folder' className='me-2' /> Projects
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/tasks'>
                <MDBIcon icon='tasks' className='me-2' /> Tasks
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className='nav-item'>
                <Link className='nav-link' to='/admin'>
                  <MDBIcon icon='user-shield' className='me-2' /> Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
        {/* User dropdown fixed at bottom */}
        <div className='border-top p-3 mt-auto'>
          <MDBDropdown dropup>
            <MDBDropdownToggle tag='a' className='nav-link d-flex align-items-center' role='button'>
              <MDBIcon icon='user-circle' size='lg' className='me-2 text-secondary' />
              <span>{user?.name || 'User'}</span>
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem link onClick={() => navigate('/')}>Dashboard</MDBDropdownItem>
              <MDBDropdownItem link onClick={() => navigate('/profile')}>Profile</MDBDropdownItem>
              <MDBDropdownItem divider />
              <MDBDropdownItem link onClick={onLogout} className='text-danger'>
                <MDBIcon icon='sign-out-alt' className='me-2' />Đăng xuất
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
      </div>
      {/* Main content */}
      <div style={{ marginLeft: 240, flex: 1, padding: '32px 24px', background: '#fff', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}

export default MainLayout; 