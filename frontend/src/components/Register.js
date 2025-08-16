import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import styles from './style.component/Register.module.css';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaArrowLeft } from 'react-icons/fa';

const createInputField = (id, type, placeholder, value, setValue, error, Icon) => (
  <div className={styles.inputGroup}>
    <Icon className={styles.inputIcon} />
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles.input}
    />
    {error && <span className={styles.errorText}>{error}</span>}
  </div>
);

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Tên người dùng là bắt buộc';
    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        await register(username, email, password);
        navigate('/login');
      } catch (error) {
        setErrors({ apiError: error.response?.data?.message || 'Đăng ký thất bại' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerImage} />
        <div className={styles.registerForm}>
          <div className={styles.formHeader}>
            <h1 className={styles.registerTitle}>
              <FaUserPlus className={styles.titleIcon} /> Đăng ký
            </h1>
            <p className={styles.registerSubtitle}>Tạo tài khoản mới</p>
          </div>

          {errors.apiError && (
            <div className={styles.errorMessage}>{errors.apiError}</div>
          )}

          <form onSubmit={handleSubmit}>
            {createInputField('inputDKND', 'text', 'Tên người dùng', username, setUsername, errors.username, FaUser)}
            {createInputField('inputDKEM', 'email', 'Email', email, setEmail, errors.email, FaEnvelope)}
            {createInputField('inputDKPW', 'password', 'Mật khẩu', password, setPassword, errors.password, FaLock)}
            {createInputField('inputDKXNPW', 'password', 'Xác nhận mật khẩu', confirmPassword, setConfirmPassword, errors.confirmPassword, FaLock)}

            <button type="submit" id="btndk" className={styles.registerButton}>
              <FaUserPlus className={styles.buttonIcon} /> Đăng ký
            </button>
          </form>

          <div className={styles.registerFooter}>
            <Link to="/login" className={styles.footerLink}>
              <FaArrowLeft className={styles.linkIcon} /> Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
