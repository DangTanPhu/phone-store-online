import { login as apiLogin, loginWithGoogle, loginWithFacebook } from '../services/api';
import { toast } from 'react-toastify';

class AuthFacade {
  static async loginWithEmail(email, password, login, navigate) {
    try {
      const response = await apiLogin(email, password);
      if (response.data.token) {
        const userData = { ...response.data.user, token: response.data.token };
        await login(userData);
        navigate(userData.role === 'admin' ? '/admin/statistics' : '/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(errorMessage);
    }
  }

  static async loginWithGoogle(login, navigate) {
    try {
      const response = await loginWithGoogle();
      if (response.data.token) {
        const userData = { ...response.data.user, token: response.data.token };
        await login(userData);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err.response?.data?.message || 'Đăng nhập bằng Google thất bại');
    }
  }

  static async loginWithFacebook(login, navigate) {
    try {
      const response = await loginWithFacebook();
      if (response.data.token) {
        const userData = { ...response.data.user, token: response.data.token };
        await login(userData);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Facebook login error:", err);
      toast.error(err.response?.data?.message || 'Đăng nhập bằng Facebook thất bại');
    }
  }
}

export default AuthFacade;
