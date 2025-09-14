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
        <div className="flex md:hidden min-h-screen flex flex-col items-center justify-center veri-gray">
          {/* Logo */}
          <img src={white_brv} alt="BURVON Logo" className="mb-4 w-40" style={{ marginTop: "-110px" }} />
          <p className="avant text-white text-lg mb-2" style={{ marginTop: "-70px" }}>Discover Timeless Elegance</p>
          <p className="avant text-gray-400 text-sm mb-1 text-center">
            Use the verification link sent to your email
          </p>
          <p className="avant text-gray-400 text-sm mb-6 text-center">
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
                  Discover Timeless Elegance
                </p>
                <p className="avant" style={{ color: "#959595", fontSize: "20px", marginBottom: "8px", marginTop: "30px" }}>
                    Use the verification link sent to your email
                </p>
                <p className="avant" style={{ color: "#959595", fontSize: "20px", marginBottom: "30px", marginTop: "-12px" }}>
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
      <div className="flex md:hidden min-h-screen flex-col items-center justify-center veri-gray p-6">
        {/* logo */}
        <img src={white_brv} alt="BURVON Logo" className="mb-8 w-32" style={{ marginTop: "-110px"}}/>
        <p className="avant text-white text-lg mb-8 text-center" style={{ color: "#959595", marginTop: "-60px", marginBottom: "16px"}}>
          Please read and accept the terms to continue
        </p>
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mr-3"
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              appearance: "none",
              border: "2px solid #959595",
              backgroundColor: acceptedTerms ? "#FFF7DC" : "transparent",
            }}
          />
          <label htmlFor="termsCheckbox" className="avant text-white" style={{ color: "#959595", fontSize: "12px" }}>
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>
        
        <button
          className={`w-full py-3 font-semibold avant border border-black ${acceptedTerms ? 'custom-btn-bg' : 'bg-gray-500'}`}
          style={{ borderRadius: "12px", marginTop: "-3px" }}
          disabled={!acceptedTerms}
          onClick={() => navigate('/')} // deretso sa homepage pagka continue
        >
          CONTINUE
        </button>
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
            <p className="avant text-white text-2xl mb-10 text-center" style={{ color: "#959595", marginTop: "-85px"}}>
              Please read and accept the terms to continue
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
              className={`w-full py-3 font-semibold avant border border-black text-lg ${acceptedTerms ? 'custom-btn-bg' : 'bg-gray-500'}`}
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