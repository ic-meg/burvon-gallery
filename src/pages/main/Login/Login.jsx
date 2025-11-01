import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import './Login.css';
import googleLoginIcon from "../../../assets/icons/googleLoginIcon.png";
import loginBG from "../../../assets/images/loginBG.png";
import white_brv from "../../../assets/logo/white_brv.png";
import loginVector from "../../../assets/images/loginVector.png";
import { sendMagicLink, googleAuth } from '../../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdminEmail = (email) => email.toLowerCase().endsWith('@rio.com');

  const handleContinue = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (isAdminEmail(email)) {
      navigate('/admin-login', { state: { email } });
      return;
    }

    setLoading(true);
    setError('');

    const result = await sendMagicLink(email);
    
    if (result.success) {
      navigate('/verification', { state: { email } });
    } else {
      setError(result.error || 'Failed to send magic link');
    }

    setLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        setLoading(true);
        setError('');
 
        const result = await googleAuth(credentialResponse.access_token);
        
        if (result.success) {
          navigate('/profile');
        } else {
          setError(result.error || 'Google login failed');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Google login error: ' + err.message);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setError('Google login failed');
    },
  });

  return (
    <>
      {/* Mobile Login */}
      <div className="block md:hidden min-h-screen flex flex-col bg-black">
        <div className="relative w-full h-screen overflow-hidden">

          {/* model image */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${loginBG})`,
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
          </div>
          {/* white overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-8 z-10"></div>

          {/* form */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-6">
            <div className="text-center mb-8 mt-12">
              <Link to="/"><img src={white_brv} alt="BURVON Logo" className="mx-auto mb-2 w-32" style={{ marginTop: "-60px" }} /></Link>
              <p className="avant" style={{ color: "#ffffffff", marginTop: "-50px", marginBottom: "32px", fontSize: "15px" }}>
                REVELED BY ALL
              </p>
            </div>
            <div className="mb-6 text-left w-full max-w-sm mx-auto" style={{ marginTop: "-35px" }}>
              <label className="block text-base font-bold mb-2 bebas" style={{ color: "#FFF7DC" }} htmlFor="email">
                EMAIL ADDRESS
              </label>

              {/* input */}
              <input
                className="w-full px-4 py-3 border avant text-base focus:outline-none"
                style={{
                  borderColor: "#FFF7DC",
                  color: "#FFF7DC",
                  borderRadius: "15px",
                  background: "transparent",
                }}
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-2 avant">{error}</p>}
            </div>

            {/* buttons */}
            <button
              className="w-full max-w-sm mx-auto py-3 font-semibold mb-6 avant border border-black"
              style={{
                borderRadius: "15px",
                backgroundColor: "#FFF7DC",
                color: "black",
              }}
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? 'SENDING...' : 'CONTINUE'}
            </button>
            <div className="flex items-center justify-center mb-8 w-full max-w-sm mx-auto">
              <div className="avant" style={{ borderTop: "2px solid #FFF7DC", width: "60px", height: "0" }}></div>
              <span className="mx-4 text-base avant" style={{ color: "#FFF7DC" }}>OR</span>
              <div className="avant" style={{ borderTop: "2px solid #FFF7DC", width: "60px", height: "0" }}></div>
            </div>
            <div className="w-full max-w-sm mx-auto google-login-wrapper">
              <button
                onClick={googleLogin}
                className="w-full py-3 font-semibold mb-6 avant border border-black flex items-center justify-center cursor-pointer"
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#FFF7DC",
                  color: "black",
                }}
                disabled={loading}
              >
                <img src={googleLoginIcon} alt="Google Login" className="mr-2 w-5 h-5" />
                {loading ? 'SENDING...' : 'CONTINUE WITH GOOGLE'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Login */}
      <div className="hidden md:flex min-h-screen flex bg-black">
        {/* left side */}
        <div className="w-1/2 h-screen relative overflow-hidden">
          {/* vector */}
          <img
            src={loginVector}
            alt=""
            className="absolute left-0 w-full h-full object-cover z-0"
            style={{ top: "160px", position: "absolute" }}
          />

          {/* model image */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-10"
            style={{ backgroundImage: `url(${loginBG})` }}
          ></div>
        </div>

        {/* right side */}
        <div className="w-1/2 flex flex-col justify-center items-center relative ">

          {/* go back */}
          <Link to="/"> <button
            className="absolute top-8 right-8 flex items-center text-xs font-semibold tracking-wide avant"
            style={{ backgroundColor: "#FFF7DC", color: "black", borderRadius: "8px", padding: "8px 14px" }}
          > 
            GO BACK <span className="ml-2">&#8594;</span>
          </button> </Link>

          {/* form */}
          <div className="w-full max-w-140 px-6" style={{ marginTop: "-120px" }}>
            <div className="text-center mb-8">
              <Link to="/"><img src={white_brv} alt="BURVON Logo" className="mx-auto mb-2 w-48" /></Link>
              <p className="avant" style={{ color: "#ffffffff", marginTop: "-67px", marginBottom: "16px", fontSize: "20px" }}>
                REVELED BY ALL
              </p>
            </div>
            <div className="mb-6 text-left">
              <label className="block text-lg font-bold mb-2 bebas" style={{ color: "#FFF7DC" }} htmlFor="email">
                EMAIL ADDRESS
              </label>

              {/* input */}
              <input
                className="w-full px-4 py-3 border avant text-base focus:outline-none focus:ring-2 focus:ring-[#FFF7DC]"
                style={{
                  borderColor: "#FFF7DC",
                  color: "#FFF7DC",
                  borderRadius: "12px",
                }}
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-2 avant">{error}</p>}
            </div>

            {/* buttons */}
            <button
              className="w-full py-2 font-semibold mb-6 hover:bg-[#f5e6c6] transition avant border border-black custom-btn-bg"
              style={{
                borderRadius: "12px",
                backgroundColor: "#FFF7DC",
                color: "black",
              }}
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? 'SENDING...' : 'CONTINUE'}
            </button>
            <div className="flex items-center justify-center mb-6">
              <div className="avant" style={{ borderTop: "2px solid #FFF7DC", width: "50px", height: "0" }}></div>
              <span className="mx-4 text-base avant" style={{ color: "#FFF7DC" }}>OR</span>
              <div className="avant" style={{ borderTop: "2px solid #FFF7DC", width: "50px", height: "0" }}></div>
            </div>
            <div className="w-full google-login-wrapper">
              <button
                onClick={googleLogin}
                className="w-full py-2 font-semibold avant border border-black hover:bg-[#f5e6c6] transition flex items-center justify-center cursor-pointer custom-btn-bg"
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#FFF7DC",
                  color: "black",
                }}
                disabled={loading}
              >
                <img src={googleLoginIcon} alt="Google Login" className="mr-2 w-5 h-5" />
                {loading ? 'SENDING...' : 'CONTINUE WITH GOOGLE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;