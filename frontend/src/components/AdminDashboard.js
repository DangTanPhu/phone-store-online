import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaChartLine, FaShoppingCart, FaUsers, FaBox, FaPlus, FaTags, FaUser, FaWarehouse, FaFileInvoiceDollar, FaUserTie, FaTruck, FaTicketAlt } from 'react-icons/fa';
import styles from './style.component/AdminDashboard.module.css';
import { useAuth } from '../contexts/AuthContext';


const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]); 

  if (!user || user.role !== 'admin') {
    return null;
  }

  const navItems = [
    { path: '/admin/profile', icon: <FaUser />, text: 'Thông tin cá nhân' },
    { path: '/admin/statistics', icon: <FaChartLine />, text: 'Thống kê' },  
    { path: '/admin/users', icon: <FaUsers />, text: 'Quản lý người dùng' },
    { path: '/admin/categories', icon: <FaTags />, text: 'Quản lý danh mục' }, 
    { path: '/admin/products', icon: <FaBox />, text: 'Quản lý sản phẩm' }, 
    { path: '/admin/create-product', icon: <FaPlus />, text: 'Thêm sản phẩm' },
    { path: '/admin/vouchers', icon: <FaTicketAlt />, text: 'Quản lý khuyến mãi' },  
    { path: '/admin/orders', icon: <FaShoppingCart />, text: 'Quản lý đơn hàng' }, 
    { path: '/admin/inventory', icon: <FaWarehouse />, text: 'Quản lý kho' },
    { path: '/admin/purchase-orders', icon: <FaFileInvoiceDollar />,text: 'Quản lý đơn đặt hàng' },
    { path: '/admin/suppliers', icon: <FaUserTie />, text: 'Quản lý nhà cung cấp' },
    { path: '/admin/deliveries', icon: <FaTruck />, text: 'Quản lý giao hàng' },
  ];

  return (
    <div className={styles.adminDashboard}>
      <aside className={styles.sidebar}>
        <h1 className={styles.dashboardTitle}>QUẢN LÝ</h1>
        <nav className={styles.dashboardNav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navButton} ${location.pathname.startsWith(item.path) ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <div className={styles.dashboardOutlet}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;