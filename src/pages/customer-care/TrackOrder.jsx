import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  trackBG, 
  trackVector,
  trackBGMobile,
} from "../../assets/index.js";


const TrackOrder = () => {
  const navigate = useNavigate();

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
          <form style={{ width: "100%", maxWidth: "500px" }}>
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
                onClick={() => navigate("/customer-care/track-order-2")}
                type="button"
                className="avant"
                style={{
                  background: "#fff7dc",
                  color: "#222",
                  padding: "1rem 3.5rem",
                  borderRadius: "15px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  marginTop: "0.5rem",
                  width: "full",
                }}
              >
                SUBMIT
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
          <form style={{ width: "100%", maxWidth: "400px" }}>
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
                type="button"
                className="avant cursor-pointer"
                onClick={() => navigate("/customer-care/track-order-2")}
                style={{
                  background: "#fff7dc",
                  color: "#222",
                  padding: "0.5rem 3.5rem",
                  borderRadius: "15px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  marginTop: "0.5rem",
                }}
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
