import React, { useState, useEffect } from 'react';
import { getAdminUsers, toggleAdminUserStatus, changeUserRole, updateUser, deleteUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaSort, FaLock, FaLockOpen, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './style.component/UserManagement.module.css';
import { toast } from 'react-toastify';
import axios from 'axios';
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { user: currentUser } = useAuth();

  // State để quản lý form cập nhật user
  const [editingUser, setEditingUser] = useState(null);
  const [updatedData, setUpdatedData] = useState({ username: '', email: '' });

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

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

  // Bật modal chỉnh sửa
  const handleEditClick = (user) => {
    setEditingUser(user);
    setUpdatedData({ username: user.username, email: user.email });
  };

  // Cập nhật state khi chỉnh sửa input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  // Gửi yêu cầu cập nhật
  const handleUpdateUser = async () => {
    try {
      if (!editingUser) {
        toast.error("Không tìm thấy thông tin người dùng.");
        return;
      }
  
      const { username, email } = updatedData;
      if (!username.trim() || !email.trim()) {
        toast.error("Tên người dùng và email không được để trống.");
        return;
      }
  
      const userId = editingUser._id;
      if (!userId) {
        toast.error("Lỗi: ID người dùng không hợp lệ.");
        return;
      }
  
      // Gọi API để cập nhật
      const response = await updateUser(userId, { username, email });
  
      if (response && !response.success) {
        toast.success("Cập nhật người dùng thành công!");
        await fetchUsers(); // Cập nhật lại danh sách
        setEditingUser(null); // Đóng modal sau khi cập nhật thành công
      } else {  
        throw new Error(response.message || "Cập nhật thất bại.");
      }
    } catch (error) {
   
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật người dùng.");
    }
  };
 
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'ascending' ? 'descending' : 'ascending' };
      }
      return { key, direction: 'ascending' };
    });
  
    setUsers((prevUsers) => {
      return [...prevUsers].sort((a, b) => {
        if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    });
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      await deleteUser(id);
      toast.success('Xóa người dùng thành công!');
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      toast.error('Xóa người dùng thất bại.');
    }
  };
  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.userManagement}>
      <h2>Quản lý người dùng</h2>
      <div className={styles.searchBar}>
        <FaSearch />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc vai trò"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('username')}>Tên <FaSort /></th>
            <th onClick={() => handleSort('email')}>Email <FaSort /></th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeUserRole(user._id, e.target.value)}
                  className={styles.roleSelect}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
                  {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </td>
              <td>
                <button 
                  onClick={() => handleEditClick(user)}
                  className={styles.editButton}
                >
                  <FaEdit /> Chỉnh sửa
                </button>
                <button 
                  onClick={() => toggleAdminUserStatus(user._id, user.isActive)}
                  className={styles.actionButton}
                >
                  {user.isActive ? <FaLock /> : <FaLockOpen />}
                  {user.isActive ? 'Khóa' : 'Mở khóa'}
                </button>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user._id)} className={styles.deleteButton}>
                  <FaTrash /> Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chỉnh sửa */}
      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Cập nhật thông tin</h3>
            <label>Tên người dùng</label>
            <input type="text" name="username" value={updatedData.username} onChange={handleChange} />
            <label>Email</label>
            <input type="email" name="email" value={updatedData.email} onChange={handleChange} />
            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleUpdateUser}>Lưu</button>
              <button className={styles.cancelButton} onClick={() => setEditingUser(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
