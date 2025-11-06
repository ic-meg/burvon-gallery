import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Login.css';
import loginBG from "../../../assets/images/loginBG.png";
import white_brv from "../../../assets/logo/white_brv.png";
import loginVector from "../../../assets/images/loginVector.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
      const response = await fetch(`${API_URL}/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Use separate keys for admin authentication
        localStorage.setItem('adminAuthToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/admin/dashboard');
      } else {
        if (data.message === 'Invalid email or password') {
          setError('Invalid email or password. Please try again.');
        } else if (data.message === 'Only admin users can login here') {
          setError('This account does not have admin access.');
        } else if (data.message === 'Account not properly configured') {
          setError('Your account is not properly configured. Please contact support.');
        } else {
          setError(data.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError(err.message || 'An error occurred while logging in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <>
      {/* Mobile Admin Login */}
      <div className="block md:hidden min-h-screen flex flex-col bg-black">
        <div className="relative w-full h-screen overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${loginBG})`,
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-8 z-10"></div>

          <div className="relative z-20 flex flex-col items-center justify-center h-full px-6">
            <div className="text-center mb-8 mt-12">
              <Link to="/"><img src={white_brv} alt="BURVON Logo" className="mx-auto mb-2 w-32" style={{ marginTop: "-60px" }} /></Link>
              <p className="avant" style={{ color: "#ffffffff", marginTop: "-50px", marginBottom: "32px", fontSize: "15px" }}>
                ADMIN ACCESS
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
              <div className="mb-6 text-left" style={{ marginTop: "-35px" }}>
                <label className="block text-base font-bold mb-2 bebas" style={{ color: "#FFF7DC" }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 border avant text-base focus:outline-none"
                  style={{
                    borderColor: "#FFF7DC",
                    color: "#959595",
                    borderRadius: "15px",
                    background: "transparent",
                  }}
                />
              </div>

              <div className="mb-6 text-left">
                <label className="block text-base font-bold mb-2 bebas" style={{ color: "#FFF7DC" }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border avant text-base focus:outline-none"
                  style={{
                    borderColor: "#FFF7DC",
                    color: "#FFF7DC",
                    borderRadius: "15px",
                    background: "transparent",
                  }}
                />
                {error && <p className="text-red-500 text-sm mt-2 avant">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 font-semibold avant border border-black mb-4"
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#FFF7DC",
                  color: "black",
                }}
                disabled={loading}
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>

            <button
              className="w-full max-w-sm mx-auto py-3 font-semibold avant border border-[#FFF7DC]"
              style={{
                borderRadius: "15px",
                backgroundColor: "transparent",
                color: "#FFF7DC",
              }}
              onClick={() => navigate('/login')}
            >
              BACK TO LOGIN
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Admin Login */}
      <div className="hidden md:flex min-h-screen flex bg-black">
        <div className="w-1/2 h-screen relative overflow-hidden">
          <img
            src={loginVector}
            alt=""
            className="absolute left-0 w-full h-full object-cover z-0"
            style={{ top: "160px", position: "absolute" }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-10"
            style={{ backgroundImage: `url(${loginBG})` }}
          ></div>
        </div>

        <div className="w-1/2 flex flex-col justify-center items-center relative">
          <Link to="/login">
            <button
              className="absolute top-8 right-8 flex items-center text-xs font-semibold tracking-wide avant"
              style={{ backgroundColor: "#FFF7DC", color: "black", borderRadius: "8px", padding: "8px 14px" }}
            >
              GO BACK <span className="ml-2">&#8592;</span>
            </button>
          </Link>

          <div className="w-full max-w-140 px-6" style={{ marginTop: "-120px" }}>
            <div className="text-center mb-8">
              <Link to="/"><img src={white_brv} alt="BURVON Logo" className="mx-auto mb-2 w-48" /></Link>
              <p className="avant" style={{ color: "#ffffffff", marginTop: "-67px", marginBottom: "16px", fontSize: "20px" }}>
                ADMIN ACCESS
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6 text-left">
                <label className="block text-lg font-bold mb-2 bebas" style={{ color: "#FFF7DC" }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 border avant text-base focus:outline-none focus:ring-2 focus:ring-[#FFF7DC]"
                  style={{
                    borderColor: "#FFF7DC",
                    color: "#959595",
                    borderRadius: "12px",
                  }}
                />
              </div>

              <div className="mb-6 text-left">
                <label className="block text-lg font-bold mb-2 bebas" style={{ color: "#FFF7DC" }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border avant text-base focus:outline-none focus:ring-2 focus:ring-[#FFF7DC]"
                  style={{
                    borderColor: "#FFF7DC",
                    color: "#FFF7DC",
                    borderRadius: "12px",
                  }}
                />
                {error && <p className="text-red-500 text-sm mt-2 avant">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2 font-semibold hover:bg-[#f5e6c6] transition avant border border-black custom-btn-bg mb-4"
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#FFF7DC",
                  color: "black",
                }}
                disabled={loading}
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>

            <button
              className="w-full py-2 font-semibold hover:bg-[#f5e6c6] transition avant border border-[#FFF7DC]"
              style={{
                borderRadius: "12px",
                backgroundColor: "transparent",
                color: "#FFF7DC",
              }}
              onClick={() => navigate('/login')}
            >
              BACK TO LOGIN
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
