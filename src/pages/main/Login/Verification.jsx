import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import loginBG from "../../../assets/images/loginBG.png";
import white_brv from "../../../assets/logo/white_brv.png";
import loginVector from "../../../assets/images/loginVector.png";
import { verifyToken, sendMagicLink } from '../../../services/authService';

const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsScreen, setShowTermsScreen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resendCounter, setResendCounter] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token');
    const emailFromState = location.state?.email;

    if (emailFromState) {
      setEmail(emailFromState);
    }

    if (token) {
      verifyTokenHandler(token);
    } else if (emailFromState) {
      setLoading(false);
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, []);

  const verifyTokenHandler = async (token) => {
    try {
      const result = await verifyToken(token);

      if (result.success) {
        setShowTermsScreen(true);
      } else {
        setError(result.error || 'Invalid or expired token');
      }
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCounter > 0) return;

    const result = await sendMagicLink(email);
    if (result.success) {
      setResendCounter(60);
    } else {
      setError(result.error || 'Failed to resend link');
    }
  };

  useEffect(() => {
    let interval;
    if (resendCounter > 0) {
      interval = setInterval(() => {
        setResendCounter((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCounter]);

  if (!showTermsScreen) {
    return (
      <>
        {/* Mobile Verification */}
        <div className="flex md:hidden min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
          {/* Background image */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${loginBG})`,
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
            {/* white overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-8 z-10"></div>
          </div>
          {/* Content */}
          <div className="relative z-20 flex flex-col items-center w-full px-6">
            <img src={white_brv} alt="BURVON Logo" className="mb-4 w-40" style={{ marginTop: "-110px" }} />
            <p className="avant text-white text-base mb-2" style={{ marginTop: "-65px" }}>REVELED BY ALL</p>
            
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#FFF7DC] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="avant text-sm text-white text-center">Verifying your email...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center">
                <p className="avant text-sm text-red-500 text-center mb-4">{error}</p>
                <button
                  className="py-3 px-6 font-semibold avant border border-black"
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#FFF7DC",
                    color: "black",
                  }}
                  onClick={() => navigate('/login')}
                >
                  Go back to login
                </button>
              </div>
            ) : (
              <>
                <p className="avant text-sm text-white mb-1 text-center">
                  Use the verification link sent to your email
                </p>
                <p className="avant text-white text-sm mb-6 text-center">
                  {email}
                </p>
                <button
                  className="py-3 px-6 font-semibold avant border border-black disabled:opacity-50"
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#FFF7DC",
                    color: "black",
                  }}
                  onClick={handleResend}
                  disabled={resendCounter > 0}
                >
                  {resendCounter > 0 ? `Resend (${resendCounter})` : "Didn't receive a link? Resend"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Desktop Verification */}
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
          <div className="w-1/2 flex flex-col justify-center items-center relative">
            {/* go back */}
            <button
              className="absolute top-8 right-8 flex items-center text-xs font-semibold tracking-wide avant"
              style={{ backgroundColor: "#FFF7DC", color: "black", borderRadius: "8px", padding: "8px 14px" }}
              onClick={() => navigate('/login')}
            >
              GO BACK <span className="ml-2">&#8592;</span>
            </button>

            {/* form */}
            <div className="w-full max-w-140 px-6" style={{ marginTop: "-120px" }}>
              <div className="text-center mb-8">
                <img src={white_brv} alt="BURVON Logo" className="mx-auto mb-2 w-55" />
                <p className="avant" style={{ color: "#ffffffff", marginTop: "-79px", marginBottom: "16px", fontSize: "20px" }}>
                  REVELED BY ALL
                </p>
                
                {loading ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="w-16 h-16 border-4 border-[#FFF7DC] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="avant text-white">Verifying your email...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center py-8">
                    <p className="avant text-red-500 text-lg mb-6">{error}</p>
                    <button
                      className="py-3 px-6 font-semibold avant border border-black"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "#FFF7DC",
                        color: "black",
                      }}
                      onClick={() => navigate('/login')}
                    >
                      Go back to login
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="avant" style={{ color: "#ffffffff", fontSize: "20px", marginBottom: "8px", marginTop: "30px" }}>
                      Use the verification link sent to your email
                    </p>
                    <p className="avant" style={{ color: "#ffffffff", fontSize: "20px", marginBottom: "30px", marginTop: "-12px" }}>
                      {email}
                    </p>
                    <button
                      className="py-3 px-6 font-semibold avant border border-black disabled:opacity-50"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "#FFF7DC",
                        color: "black",
                      }}
                      onClick={handleResend}
                      disabled={resendCounter > 0}
                    >
                      {resendCounter > 0 ? `Resend (${resendCounter})` : "Didn't receive a link? Resend"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Terms Acceptance
  return (
    <>
      {/* Mobile Terms */}
      <div className="flex md:hidden min-h-screen flex-col items-center justify-center bg-black p-6 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${loginBG})`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
          {/* white overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-8 z-10"></div>

        </div>
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center w-full">
          <img src={white_brv} alt="BURVON Logo" className="mb-8 w-32" style={{ marginTop: "-110px"}}/>
          <p className="avant text-sm sm:text-lg mb-8 text-center" style={{ color: "#ffffffff", marginTop: "-60px", marginBottom: "16px", whiteSpace: "nowrap" }}>
            PLEASE READ AND ACCEPT THE TERMS TO CONTINUE
          </p>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mr-3"
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                appearance: "none",
                border: "2px solid #959595",
                backgroundColor: acceptedTerms ? "#FFF7DC" : "transparent",
              }}
            />
            <label htmlFor="termsCheckbox" className="avant" style={{ color: "#ffffffff", fontSize: "13px", whiteSpace: "nowrap" }}>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          <button
            className={`w-full py-3 font-semibold avant rounded-[12px] mt-[-3px] ${acceptedTerms ? 'bg-[#FFF7DC] text-black' : 'bg-[#181818] text-[#FFF7DC] cursor-not-allowed opacity-90'}`}
            disabled={!acceptedTerms}
            onClick={() => navigate('/')}
          >
            CONTINUE
          </button>
        </div>
      </div>

      {/* Desktop Terms */}
      <div className="hidden md:flex min-h-screen bg-black">
        {/* left side */}
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

        {/* right side */}
        <div className="w-1/2 flex flex-col justify-center items-center p-12 relative">
          <button
            className="absolute top-8 right-8 flex items-center text-xs font-semibold tracking-wide avant"
            style={{ backgroundColor: "#FFF7DC", color: "black", borderRadius: "8px", padding: "8px 14px" }}
            onClick={() => setShowTermsScreen(false)}
          >
            GO BACK <span className="ml-2">&#8592;</span>
          </button>

          <div className="w-full max-w-md">
            {/* logo */}
            <img src={white_brv} alt="BURVON Logo" className="mx-auto mb-20 w-40" style={{ marginTop: "-20px" }} />
            <p className="avant text-white text-xl mb-10 text-center" style={{ color: "#ffffffff", marginTop: "-120px", whiteSpace: "nowrap" }}>
              PLEASE READ AND ACCEPT THE TERMS TO CONTINUE

            </p>
            
            <div className="flex items-start mb-4">
              <input
                type="checkbox"
                id="termsCheckboxDesktop"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 mr-3"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  appearance: "none",
                  border: "2px solid #959595",
                  backgroundColor: acceptedTerms ? "#FFF7DC" : "transparent",
                }}
              />
              <label htmlFor="termsCheckboxDesktop" className="avant text-white text-lg">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            
            <button
              className={`w-full py-3 font-semibold avant text-lg rounded-[12px] mt-[-2px] ${acceptedTerms ? 'bg-[#FFF7DC] text-black' : 'bg-[#181818] text-[#FFF7DC] cursor-not-allowed opacity-90'}`}
              disabled={!acceptedTerms}
              onClick={() => navigate('/')}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verification;