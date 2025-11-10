import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  trackBG, 
  trackVector,
  trackBGMobile,
} from "../../assets/index.js";
import orderApi from "../../api/orderApi";
import Toast from "../../components/Toast";


const TrackOrder = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result = null;
      let searchType = "";

      if (orderId.trim()) {
        const cleanOrderId = orderId.trim().replace(/^#/, '');
        
        // Validate order ID is a number
        if (isNaN(cleanOrderId) || cleanOrderId === '') {
          setError("Please enter a valid Order ID (numbers only)");
          setToast({ show: true, message: "Invalid Order ID format", type: 'error' });
          setLoading(false);
          return;
        }

        searchType = "Order ID";
        result = await orderApi.getOrderDetails(cleanOrderId);
      } 
      // Otherwise try tracking number
      else if (trackingNumber.trim()) {
        searchType = "Tracking Number";
        result = await orderApi.getOrderByTrackingNumber(trackingNumber.trim());
      } 
      else {
        setError("Please provide either an Order ID or Tracking Number");
        setLoading(false);
        return;
      }

      if (result.error) {
        if (result.status === 404 || result.error.toLowerCase().includes('not found')) {
          setError(`No order found with this ${searchType.toLowerCase()}. Please check and try again.`);
          setToast({ 
            show: true, 
            message: `Order not found with this ${searchType.toLowerCase()}`, 
            type: 'error' 
          });
        } else if (result.status === 401 || result.status === 403) {
          setError("You don't have permission to view this order. Please contact support if you believe this is an error.");
          setToast({ 
            show: true, 
            message: "Access denied", 
            type: 'error' 
          });
        } else {
          setError(`Unable to retrieve order. ${result.error}. Please try again later.`);
          setToast({ 
            show: true, 
            message: result.error || "Failed to retrieve order", 
            type: 'error' 
          });
        }
        setLoading(false);
        return;
      }

      if (result.data && result.data.success === false) {
        const errorMessage = result.data.message || result.data.error;
        
        if (errorMessage && errorMessage.toLowerCase().includes('not found')) {
          setError(`No order found with this ${searchType.toLowerCase()}. Please verify your ${searchType.toLowerCase()} and try again.`);
          setToast({ 
            show: true, 
            message: `Order not found with this ${searchType.toLowerCase()}`, 
            type: 'error' 
          });
        } else {
          setError(errorMessage || `Unable to find order with this ${searchType.toLowerCase()}.`);
          setToast({ 
            show: true, 
            message: errorMessage || "Order not found", 
            type: 'error' 
          });
        }
        setLoading(false);
        return;
      }

        // Extract order data
      const orderData = result.data?.data || result.data;
      
      if (!orderData || !orderData.order_id) {
        setError(`No order found with this ${searchType.toLowerCase()}. Please check your ${searchType.toLowerCase()} and try again.`);
        setToast({ 
          show: true, 
          message: `Order not found with this ${searchType.toLowerCase()}`, 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      // Navigate to track order results page with order data
      navigate("/customer-care/track-order-2", { 
        state: { order: orderData } 
      });
    } catch (err) {
      console.error("Error tracking order:", err);
      setError("An unexpected error occurred. Please check your connection and try again.");
      setToast({ 
        show: true, 
        message: "Network error. Please try again.", 
        type: 'error' 
      });
      setLoading(false);
    }
  };

  return (
    <Layout full>
      <div
        className="hidden md:flex flex-row min-h-screen"
        style={{ padding: "2rem", overflow: "hidden" }}
      >
        {/* desktop: left form */}
        <div
          className="track-order-form mt-[130px] flex justify-center"
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 2rem",
            maxWidth: "700px",
            zIndex: 3, 
          }}
        >
          <h1
            className="bebas"
            style={{
              color: "#fff7dc",
              fontSize: "5.5rem",
              marginBottom: "0.5rem",
              letterSpacing: "2px",
              textAlign: "center",
            }}
          >
            TRACK YOUR ORDER
          </h1>
          <h2
            className="avant"
            style={{
              color: "#fff7dc",
              fontSize: "1.6rem",
              marginBottom: "2.5rem",
              fontWeight: "normal",
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            STAY IN THE LOOP WITH US.
          </h2>

          {/* desktop: forms */}
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px" }}>
            {error && (
              <div
                style={{
                  color: "#ff6b6b",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                  fontFamily: "avant",
                }}
              >
                {error}
              </div>
            )}
            <label
              className="bebas"
              style={{
                color: "#fff7dc",
                fontSize: "1.3rem",
                marginBottom: "0.5rem",
                display: "block",
                letterSpacing: "1px",
              }}
            >
              ORDER ID
            </label>
            <input
              type="text"
              className="avant"
              placeholder="Order ID (e.g., #38940123)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.9rem 1.5rem",
                borderRadius: "15px",
                border: "2px solid #fff7dc",
                marginBottom: "1.5rem",
                fontFamily: "avant",
                fontSize: "1.1rem",
                color: "#fff7dc",
                background: "transparent",
                letterSpacing: "1px",
                outline: "none",
              }}
            />
            <label
              className="bebas"
              style={{
                color: "#fff7dc",
                fontSize: "1.3rem",
                marginBottom: "0.5rem",
                display: "block",
                letterSpacing: "1px",
              }}
            >
              TRACKING NUMBER
            </label>
            <input
              type="text"
              className="avant"
              placeholder="Tracking No."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              style={{
                width: "100%",
                padding: "0.9rem 1.5rem",
                borderRadius: "15px",
                border: "2px solid #fff7dc",
                marginBottom: "2rem",
                fontFamily: "avant",
                fontSize: "1.1rem",
                color: "#fff7dc",
                background: "transparent",
                letterSpacing: "1px",
                outline: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                className="avant"
                style={{
                  background: loading ? "#666" : "#fff7dc",
                  color: "#222",
                  padding: "1rem 3.5rem",
                  borderRadius: "15px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "1px",
                  marginTop: "0.5rem",
                  width: "full",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "SEARCHING..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>

        {/* desktop: right image */}
        {/* desktop: vector bg */}
        <img
          src={trackVector}
          alt="Track Vector"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            maxWidth: "930px",
            height: "auto",
            maxHeight: "80vh",
            zIndex: 1,
            transform: "translate(350px, 80px)",
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
        <div
          className="flex-1 flex items-stretch justify-end m-0 p-0"
          style={{
            width: "60%",
            overflow: "visible",
            position: "relative",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            display: "flex",
            margin: 0,
            padding: 0,
          }}
        >
          {/* desktop: main bg */}
          <img
            src={trackBG}
            alt="Track Order Background"
            className="ml-100"
            style={{
              width: "120%",
              height: "100vh",
              objectFit: "cover",
              display: "block",
              marginTop: 0,
              marginLeft: "auto",
              marginRight: "-20%",
              marginBottom: 0,
              border: "none",
              position: "absolute",
              bottom: "-50px",
              right: 0,
              top: 60,
              zIndex: 2,
              pointerEvents: 'none',
              boxShadow: "0 0 20px 10px rgba(0, 0, 0, 0.55)",
            }}
          />
        </div>
      </div>

      {/* Mobile Track Order */}
      <div className="flex flex-col md:hidden min-h-screen bg-[#181818]">
        {/* mobile: main container of image and title */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "320px",
            overflow: "hidden",
            marginTop: "78px",
          }}
        >
          {/* mobile: top image */}
          <img
            src={trackBGMobile}
            alt="Track Order Background"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              filter: "brightness(0.7)",
            }}
          />

          {/* mobile: overlay title*/}
          <div
            style={{
              position: "absolute",

              left: "50%",
              transform: "translateX(-50%)",
              marginTop: "120px",
              width: "90%",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <h1
              className="bebas"
              style={{
                color: "#fff7dc",
                fontSize: "3rem",
                marginBottom: "0.1rem",
                letterSpacing: "2px",
              }}
            >
              TRACK YOUR ORDER
            </h1>
            <h2
              className="avant"
              style={{
                color: "#fff7dc",
                fontSize: "1.2rem",
                fontWeight: "normal",
                letterSpacing: "1px",
              }}
            >
              STAY IN THE LOOP WITH US.
            </h2>
          </div>
        </div>

        {/* mobile: forms */}
        <div
          className="track-order-form"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "5rem 1.5rem",
            background: "transparent",
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
            {error && (
              <div
                style={{
                  color: "#ff6b6b",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                  fontFamily: "avant",
                }}
              >
                {error}
              </div>
            )}
            <label
              className="bebas"
              style={{
                color: "#fff7dc",
                fontSize: "1.4rem",
                marginBottom: "0.5rem",
                display: "block",
                letterSpacing: "1px",
                cursor: 'pointer',
              }}
            >
              ORDER ID
            </label>
            <input
              type="text"
              className="avant"
              placeholder="Order ID (e.g., #38940123)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.8rem 1.5rem",
                borderRadius: "15px",
                border: "1px solid #fff7dc",
                marginBottom: "1.5rem",
                fontFamily: "avant",
                fontSize: "1.1rem",
                color: "#fff7dc",
                background: "transparent",
                letterSpacing: "1px",
                outline: "none",
              }}
            />
            <label
              className="bebas"
              style={{
                color: "#fff7dc",
                fontSize: "1.4rem",
                marginBottom: "0.5rem",
                display: "block",
                letterSpacing: "1px",
                cursor: 'pointer',
              }}
            >
              TRACKING NUMBER
            </label>
            <input
              type="text"
              className="avant"
              placeholder="Tracking No."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              style={{
                width: "100%",
                padding: "0.8rem 1.5rem",
                borderRadius: "15px",
                border: "1px solid #fff7dc",
                marginBottom: "2rem",
                fontFamily: "avant",
                fontSize: "1.1rem",
                color: "#fff7dc",
                background: "transparent",
                letterSpacing: "1px",
                outline: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                className="avant cursor-pointer"
                style={{
                  background: loading ? "#666" : "#fff7dc",
                  color: "#222",
                  padding: "0.5rem 3.5rem",
                  borderRadius: "15px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "1px",
                  marginTop: "0.5rem",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "SEARCHING..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ show: false, message: '', type: 'error' })}
      />
    </Layout>
  );
};

export default TrackOrder;
