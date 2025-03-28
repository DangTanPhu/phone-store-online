import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin, loginWithGoogle, loginWithFacebook } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import styles from './style.component/Login.module.css';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaKey, FaGoogle, FaFacebook } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await apiLogin(email, password);
    console.log(response); // Check the response here
    if (response.data.token) {
      const userData = {
        ...response.data.user,
        token: response.data.token
      };
      await login(userData);
      if (userData.role === 'admin') {
        navigate('/admin/statistics');
      } else {
        navigate('/dashboard');
      }
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại';
    toast.error(errorMessage);
  }
};

  const handleGoogleLogin = useCallback(async () => {
    try {
      const response = await loginWithGoogle();
      if (response.data.token) {
        const userData = {
          ...response.data.user,
          token: response.data.token
        };
        await login(userData);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập bằng Google thất bại');
    }
  }, [login, navigate]);

  const handleFacebookLogin = useCallback(async () => {
    try {
      const response = await loginWithFacebook();
      if (response.data.token) {
        const userData = {
          ...response.data.user,
          token: response.data.token
        };
        await login(userData);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập bằng Facebook thất bại');
    }
  }, [login, navigate]);

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* <div className={styles.loginImage}>
        </div> */}
        <div className={styles.loginForm}>
          <h1 className={styles.loginTitle}>Đăng nhập</h1>
          <p className={styles.loginSubtitle}>Chào mừng bạn đến với thế giới điện thoại của chúng tôi</p>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.inputIcon} />
              <input
               id="email" // Thêm id cho ô nhập email
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <FaLock className={styles.inputIcon} />
              <input
               id="password" // Thêm id cho ô nhập mật khẩu
               type="password"
               placeholder="Mật khẩu"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               className={styles.input}
              />
            </div>
            <button type="submit" id='btndn' className={styles.loginButton}>
              {/* <FaSignInAlt className={styles.buttonIcon} /> Đăng nhập */}
              Đăng nhập
            </button>
          </form>
          <div className={styles.socialLogin}>
            <button onClick={handleGoogleLogin} className={`${styles.socialButton} ${styles.googleButton}`}>
              <FaGoogle className={styles.buttonIcon} /> Google
            </button>
            <button onClick={handleFacebookLogin} className={`${styles.socialButton} ${styles.facebookButton}`}>
              <FaFacebook className={styles.buttonIcon} /> Facebook
            </button>
          </div>
          <div className={styles.loginFooter}>
            <Link to="/forgot-password" className={styles.footerLink}>
              <FaKey className={styles.linkIcon} /> Quên mật khẩu?
            </Link>
            <Link to="/register" className={styles.footerLink}>
              <FaUserPlus className={styles.linkIcon} /> Tạo tài khoản mới
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;