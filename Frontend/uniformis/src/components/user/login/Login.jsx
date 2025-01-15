import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../axiosconfig';
import { setAuthData } from '../../../redux/auth/authSlice';
import './Login.css';
import logo from '../../../assets/logo.png'; 
import googleLogo from '../../../assets/google-logo.png'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login/', { email, password });
            const { user, token } = response.data; 
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            dispatch(setAuthData(response.data));
            setError(''); 
            navigate('/home');
        } catch (error) {
            if (error.response && error.response.status === 401) {
               
                setError('Invalid username or password.');
            } else {
                setError('Something went wrong. Please try again later.');
            }
            console.error('Login Failed:', error);
        }
    };

    return (
        <div className="login-container">
        <div className="login-content"> 
          <div className="logo-section">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>
  
          <div className="form-section"> 
            <h2>Welcome Back!</h2>
            <p>Log in to your account</p>

                {error && <h6 className="err-msg1">{error}</h6>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button1">
                        Login
                    </button>
                <div className="form-actions"> 
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
              
            </div>

            <div className="signup-link">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="signup">
                  Sign Up
                </Link>
              </p>
            </div>

            <button type="button" className="google-login">
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
    );
};

export default Login;
