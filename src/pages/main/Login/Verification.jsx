import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import loginBG from "../../../assets/images/loginBG.png";
import white_brv from "../../../assets/logo/white_brv.png";
import loginVector from "../../../assets/images/loginVector.png";

const Verification = () => {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsScreen, setShowTermsScreen] = useState(false);

  // Simulate verification success after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTermsScreen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="relative z-20 flex flex-col items-center w-full">
            <img src={white_brv} alt="BURVON Logo" className="mb-4 w-40" style={{ marginTop: "-110px" }} />
            <p className="avant text-white text-base mb-2" style={{ marginTop: "-65px" }}>REVELED BY ALL</p>
            <p className="avant text-sm text-white mb-1 text-center">
              Use the verification link sent to your email
            </p>
            <p className="avant text-white text-sm mb-6 text-center">
              youremail@gmail.com
            </p>
            <button
              className="py-3 px-6 font-semibold avant border border-black"
              style={{
                borderRadius: "8px",
                backgroundColor: "#FFF7DC",
                color: "black",
              }}
            >
              Didn't receive a link? Resend (51)
            </button>
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
                <p className="avant" style={{ color: "#ffffffff", fontSize: "20px", marginBottom: "8px", marginTop: "30px" }}>
                    Use the verification link sent to your email
                </p>
                <p className="avant" style={{ color: "#ffffffff", fontSize: "20px", marginBottom: "30px", marginTop: "-12px" }}>
                    youremail@gmail.com
                </p>
                <button
                    className="py-3 px-6 font-semibold avant border border-black"
                    style={{
                    borderRadius: "8px",
                    backgroundColor: "#FFF7DC",
                    color: "black",
                    }}
                >
                    Didn't receive a link? Resend (51)
                </button>
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
          <p className="avant text-sm sm:text-lg mb-8 text-center cream-text" style={{ marginTop: "-60px", marginBottom: "16px", whiteSpace: "nowrap" }}>
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
            <label htmlFor="termsCheckbox" className="avant cream-text" style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          <button
            className={`w-full py-3 font-semibold avant ${acceptedTerms ? 'custom-btn-bg' : 'bg-gray-500'}`}
            style={{ borderRadius: "12px", marginTop: "-3px" }}
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
              className={`w-full py-3 font-semibold avant text-lg ${acceptedTerms ? 'custom-btn-bg' : 'bg-gray-500'}`}
              style={{ borderRadius: "12px", marginTop: "-2px" }} 
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