import React, { useState, useEffect } from 'react';
import { getAdminUsers, toggleAdminUserStatus, changeUserRole ,createUser,updateUser,deleteUser} from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaSort, FaLock, FaLockOpen, FaUserEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import styles from './style.component/UserManagement.module.css';
import { toast } from 'react-toastify';
import axios from 'axios';
const StatusBadge = ({ isActive, isLocked }) => {
  const getStatusInfo = () => {
    if (!isActive) {
      return {
        text: 'Bị khóa',
        className: styles.statusInactive
      };
    } 
    if (isLocked) {
      return {
        text: 'Tạm khóa',
        className: styles.statusLocked
      };
    }
    return {
      text: 'Hoạt động',
      className: styles.statusActive
    };
  };

  const { text, className } = getStatusInfo();

  return (
    <span className={`${styles.statusBadge} ${className}`}>
      {text}
    </span>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { user, user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await deleteUser(userId);
        fetchUsers();
        toast.success("Xóa người dùng thành công!");
      } catch (error) {
        toast.error("Xóa người dùng thất bại!");
        console.error("Lỗi khi xóa người dùng:", error);
      }
    }
  };
  const handleAddUser = async () => {
    try {
      await createUser(newUser);
      toast.success('Người dùng đã được thêm thành công!');
      fetchUsers();
      setIsModalOpen(false);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
    } catch (error) {
      toast.error('Không thể thêm người dùng!');
      console.error('Lỗi khi thêm người dùng:', error);
    }
  };
  const handleUpdateUser = async () => {
    try {
      await updateUser(editUser._id, editUser);
      toast.success('Cập nhật người dùng thành công!');
      fetchUsers();
      setIsEditModalOpen(false);
      setEditUser(null);
    } catch (error) {
      toast.error('Không thể cập nhật người dùng!');
      console.error('Lỗi khi cập nhật người dùng:', error);
    }
  };
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAdminUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const response = await toggleAdminUserStatus(userId, !isActive);
      if (response && response.data) {
        await fetchUsers();
        return response.data;
      }
      throw new Error('Không nhận được phản hồi từ server');
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);
      fetchUsers(); // Tải lại danh sách người dùng
      alert('Thay đổi vai trò người dùng thành công');
    } catch (error) {
      console.error('Error changing user role:', error);
      alert('Không thể thay đổi vai trò người dùng. Vui lòng thử lại sau.');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const result = await toggleUserStatus(userId, currentStatus);
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ));
      toast.success(result.message || 'Thay đổi trạng thái người dùng thành công');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi thay đổi trạng thái người dùng';
      toast.error(errorMessage);
      console.error('Error toggling user status:', error);
    }
  };


  const useCreateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const createUser = async (userData) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.post("http://localhost:7070/api/createUser", userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        alert("Người dùng đã được tạo thành công!");
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Đã xảy ra lỗi khi tạo người dùng");
      } finally {
        setLoading(false);
      }
    };
  
    return { createUser, loading, error };
  };
  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  const handleEditUser = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };
  
  return (
    <div className={styles.userManagement}>
      <h2>QUẢN LÝ NGƯỜI DÙNG</h2>
      <div className={styles.searchBar}>
        <FaSearch />
        <input
          id="TKND"
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc vai trò"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button id="themND" className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          <FaUserPlus /> Thêm Người Dùng
        </button>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('username')}>Tên <FaSort /></th>
            <th onClick={() => handleSort('email')}>Email <FaSort /></th>
            <th onClick={() => handleSort('role')}>Vai trò <FaSort /></th>
            <th onClick={() => handleSort('isActive')}>Trạng thái <FaSort /></th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select
                  id="chonrole"
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className={styles.roleSelect}
                >
                  <option id="userrrrr" value="user">User</option>
                  <option id="adminnnn" value="admin">Admin</option>
                </select>
              </td>
              <td>
                <StatusBadge isActive={user.isActive} isLocked={user.isLocked} />
              </td>
              <td>
                <button 
                  onClick={() => handleToggleStatus(user._id, user.isActive)}
                  className={`${styles.actionButton} ${user.isActive ? styles.lockButton : styles.unlockButton}`}
                  disabled={user._id === currentUser?._id}
                  title={user._id === currentUser?._id ? 'Không thể khóa tài khoản của chính mình' : ''}
                >
                  {user.isActive ? <FaLock /> : <FaLockOpen />}
                  {user.isActive ? 'Khóa' : 'Mở khóa'}
                </button>
                <button  className={styles.iconButton} onClick={() => handleEditUser(user)}>
                 <FaUserEdit />
                  </button>
                      <button  className={styles.iconButton} onClick={() => handleDeleteUser(user._id)}>
                  <FaTrash />
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div id="1-1" className={styles.modal}>
            <h3>Thêm Người Dùng</h3>
            <input id="2-2" type="text" placeholder="Tên người dùng" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} />
            <input id="3-3" type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
            <input id="4-4" type="password" placeholder="Mật khẩu" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
            <select id="5-5" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
              <option id="6-6" value="user">User</option>
              <option id="7-7" value="admin">Admin</option>
            </select>
            <div className={styles.modalActions}>
              <button id="8-8" onClick={handleAddUser}>Thêm</button>
              <button id="9-9" onClick={() => setIsModalOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
        {isEditModalOpen && editUser && (
  <div className={styles.modalOverlay}>
    <div id="11-11" className={styles.modal}>
      <h3>Chỉnh Sửa Người Dùng</h3>
      <input id="10-10" type="text" value={editUser.username || ''} 
        onChange={(e) => setEditUser({...editUser, username: e.target.value})} />
      <input id="12-12" type="email" value={editUser.email || ''} 
        onChange={(e) => setEditUser({...editUser, email: e.target.value})} />
      <select id="13-13" value={editUser.role || ''}
      onChange={(e) => setEditUser({...editUser, role: e.target.value})}>
      <option id="14-14" value="user">User</option>
      <option id="15-15" value="admin">Admin</option>
    </select>
    <div className={styles.modalActions}>
      <button id="16-16" onClick={handleUpdateUser}>Cập nhật</button>
      <button id="17-17" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
    </div>
  </div>
</div>
)}

    <div className={styles.pagination}>
      {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
        <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? styles.active : ''} style={{backgroundColor:'white',borderRadius:'5px', color:'black', backgroundSize:'13', border: '2px dashed black',marginLeft:'5px'}} >
          {i + 1}
        </button> 
      ))}
    </div>
  </div>
);
};

export default UserManagement;
