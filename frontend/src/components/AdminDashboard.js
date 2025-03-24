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
    { id: 'nav-profile', path: '/admin/profile', icon: <FaUser />, text: 'Thông tin cá nhân' },
    { id: 'nav-statistics', path: '/admin/statistics', icon: <FaChartLine />, text: 'Thống kê' },  
    { id: 'nav-users', path: '/admin/users', icon: <FaUsers />, text: 'Quản lý người dùng' },
    { id: 'nav-categories', path: '/admin/categories', icon: <FaTags />, text: 'Quản lý danh mục' }, 
    { id: 'nav-products', path: '/admin/products', icon: <FaBox />, text: 'Quản lý sản phẩm' }, 
    { id: 'nav-create-product', path: '/admin/create-product', icon: <FaPlus />, text: 'Thêm sản phẩm' },
    { id: 'nav-vouchers', path: '/admin/vouchers', icon: <FaTicketAlt />, text: 'Quản lý khuyến mãi' },  
    { id: 'nav-orders', path: '/admin/orders', icon: <FaShoppingCart />, text: 'Quản lý đơn hàng' }, 
    { id: 'nav-inventory', path: '/admin/inventory', icon: <FaWarehouse />, text: 'Quản lý kho' },
    { id: 'nav-purchase-orders', path: '/admin/purchase-orders', icon: <FaFileInvoiceDollar />, text: 'Quản lý đơn đặt hàng' },
    { id: 'nav-suppliers', path: '/admin/suppliers', icon: <FaUserTie />, text: 'Quản lý nhà cung cấp' },
    { id: 'nav-deliveries', path: '/admin/deliveries', icon: <FaTruck />, text: 'Quản lý giao hàng' },
  ];

  return (
    <div id="admin-dashboard" className={styles.adminDashboard}>
      <aside id="admin-sidebar" className={styles.sidebar}>
        <h1 id="dashboard-title" className={styles.dashboardTitle}>QUẢN LÝ</h1>
        <nav id="dashboard-nav" className={styles.dashboardNav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              id={item.id}
              to={item.path}
              className={`${styles.navButton} ${location.pathname.startsWith(item.path) ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main id="admin-main-content" className={styles.mainContent}>
        <div id="dashboard-outlet" className={styles.dashboardOutlet}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;