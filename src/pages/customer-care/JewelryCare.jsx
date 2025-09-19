import React, { useState, useEffect } from "react";
import "./JewelryCare.css";
import Layout from "../../components/Layout";

import {
   jewelrycareBG,
   jewelrycareBG1,
   gentleCleanseIcon,
   rinseOffIcon,
   dryAirIcon,
   checkIcon,
   xIcon,
   PrevFacts,
   NextFacts,
} from "../../assets/index.js";

const carouselData = [
  {
    icon: gentleCleanseIcon,
    title: "GENTLE CLEANSE",
    text: (
      <>
        Dip a <span style={{ fontWeight: 700 }}>soft cloth</span> or{" "}
        <span style={{ fontWeight: 700 }}>microfiber cloth</span> in{" "}
        <span style={{ fontWeight: 700 }}>warm water</span> and{" "}
        <span style={{ fontWeight: 700 }}>gentle soap</span> combination. Use
        this to clean your jewelry. Make sure to clean{" "}
        <span style={{ fontWeight: 700 }}>all</span> sides.
      </>
    ),
  },
  {
    icon: rinseOffIcon,
    title: "RINSE OFF",
    text: (
      <>
        To rinse off, use <span style={{ fontWeight: 700 }}>soft cloth</span> or{" "}
        <span style={{ fontWeight: 700 }}>microfiber cloth</span> dipped in
        clean water. Wipe off any soap residue until jewelry is polished.
      </>
    ),
  },
  {
    icon: dryAirIcon,
    title: "DRY & AIR",
    text: (
      <>
        <span style={{ fontWeight: 700 }}>Dry</span> jewelry with{" "}
        <span style={{ fontWeight: 700 }}>soft cloth</span> or{" "}
        <span style={{ fontWeight: 700 }}>microfiber cloth</span> and{" "}
        <span style={{ fontWeight: 700 }}>leave</span> to{" "}
        <span style={{ fontWeight: 700 }}>air dry</span> on a{" "}
        <span style={{ fontWeight: 700 }}>cool dry place.</span>
      </>
    ),
  },
];

const JewelryCare = () => {
  const [current, setCurrent] = useState(0);

  // auto-slide effect every 3s for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1));

  return (
    <Layout full>
      {/* Mobile Jewelry Care */}
      <div className="block md:hidden min-h-screen bg-[#181818] flex flex-col">
        {/* model image*/}
        <div className="w-full h-[440px] relative overflow-hidden">
          <div
            className="absolute left-0 w-full h-full bg-center"
            style={{
              top: "-96px",
              minHeight: "536px",
              backgroundImage: `url(${jewelrycareBG1})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
            }}
          ></div>

          {/* title*/}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#FFF7DC] px-6"
            style={{ zIndex: 2 }}
          >
            <h1
              className="font-bold bebas"
              style={{ fontSize: "2.7rem", marginBottom: "0.5rem" }}
            >
              JEWELRY CARE
            </h1>
            <p
              className="avant"
              style={{ fontSize: "0.80rem", marginTop: "-0.7rem" }}
            >
              Even Rebels know how to treat their treasures right.
            </p>
          </div>
        </div>

        {/* carousel section */}
        <div className="flex flex-col items-center justify-center px-10 py-7">
          <div
            className="w-full max-w-md mx-auto bg-transparent text-[#FFF7DC] rounded-lg flex flex-col items-center"
            style={{ minHeight: "260px" }}
          >
            {/* icon */}
            <div className="flex flex-row items-center justify-center mb-4 mt-2">
              <img
                src={carouselData[current].icon}
                alt={carouselData[current].title}
                className="h-8 w-8"
              />
            </div>
            <h3
              className="font-bold avant-demi mb-3 text-center uppercase"
              style={{ fontSize: "1.35rem", letterSpacing: "1px" }}
            >
              {carouselData[current].title}
            </h3>
            <p
              className="avant-book text-center leading-relaxed text-[#FFF7DC] mb-2"
              style={{ fontSize: "1rem" }}
            >
              {current === 0 && (
                <>
                  Dip a <span style={{ fontWeight: 700 }}>soft cloth</span> or{" "}
                  <span style={{ fontWeight: 700 }}>microfiber cloth</span> in{" "}
                  <span style={{ fontWeight: 700 }}>warm water</span> and{" "}
                  <span style={{ fontWeight: 700 }}>gentle soap</span>{" "}
                  combination. Use this to clean your jewelry. Make sure to
                  clean <span style={{ fontWeight: 700 }}>all</span> sides.
                </>
              )}
              {current === 1 && (
                <>
                  To rinse off, use{" "}
                  <span style={{ fontWeight: 700 }}>soft cloth</span> or{" "}
                  <span style={{ fontWeight: 700 }}>microfiber cloth</span>{" "}
                  dipped in clean water. Wipe off any soap residue until jewelry
                  is <span style={{ fontWeight: 700 }}>polished</span>.
                </>
              )}
              {current === 2 && (
                <>
                  <span style={{ fontWeight: 700 }}>Dry</span> jewelry with{" "}
                  <span style={{ fontWeight: 700 }}>soft cloth</span> or{" "}
                  <span style={{ fontWeight: 700 }}>microfiber cloth</span> and{" "}
                  <span style={{ fontWeight: 700 }}>leave</span> to{" "}
                  <span style={{ fontWeight: 700 }}>air dry</span> on a{" "}
                  <span style={{ fontWeight: 700 }}>cool dry place.</span>
                </>
              )}
            </p>
          </div>

          {/* carousel dots */}
          <div className="flex flex-row items-center justify-center mt-4">
            <img
              src={PrevFacts}
              alt="Previous"
              className="h-6 w-6 cursor-pointer mr-8"
              onClick={handlePrev}
            />
            <div className="flex flex-row items-center justify-center space-x-2">
              {carouselData.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-3 w-3 rounded-full flex items-center justify-center ${
                    current === idx
                      ? "w-1 h-1 rounded-full border-1 border-[#fff7dc] bg-[#fff7dc]"
                      : "w-1 h-1 rounded-full border-2 border-[#fff7dc] bg-transparent"
                  }`}
                  style={{
                    opacity: current === idx ? 1 : 0.5,
                    transition: "opacity 0.2s",
                  }}
                ></span>
              ))}
            </div>
            <img
              src={NextFacts}
              alt="Next"
              className="h-6 w-6 cursor-pointer ml-8"
              onClick={handleNext}
            />
          </div>
        </div>

        {/* do and don't section mobile */}
        <div className="block md:hidden w-full">
          {/* do */}
          <div
            className="w-full py-8 px-6 flex flex-col items-center"
            style={{ background: "rgba(126, 123, 123, 0.22)" }}
          >
            <h3 className="avant-demi text-[#FFF7DC] text-2xl font-bold mb-6 text-center tracking-wide">
              DO
            </h3>
            <ul className="w-full max-w-md flex flex-col gap-6 ml-10">
              <li className="flex items-center">
                <img src={checkIcon} alt="Check" className="h-6 w-6 mr-4" />
                <span className="avant text-[#FFF7DC] text-sm">
                  Store jewelry in a clean, dry box.
                </span>
              </li>
              <li className="flex items-center">
                <img src={checkIcon} alt="Check" className="h-6 w-6 mr-4" />
                <span className="avant-book text-[#FFF7DC] text-sm">
                  Hang necklaces to prevent tangling.
                </span>
              </li>
              <li className="flex items-center">
                <img src={checkIcon} alt="Check" className="h-6 w-6 mr-4" />
                <span className="avant-book text-[#FFF7DC] text-sm">
                  Clean your pieces regularly with a soft cloth.
                </span>
              </li>
              <li className="flex items-center">
                <img src={checkIcon} alt="Check" className="h-6 w-6 mr-4" />
                <span className="avant-book text-[#FFF7DC] text-sm">
                  Use individual pouches for each item.
                </span>
              </li>
            </ul>
          </div>

          {/* don't */}
          <div className="w-full bg-[#181818] py-8 px-6 flex flex-col items-center">
            <h3 className="avant-demi text-[#FFF7DC] text-2xl font-bold mb-6 text-center tracking-wide">
              DON'T
            </h3>
            <ul className="w-full max-w-md flex flex-col gap-6 ml-10">
              <li className="flex items-center">
                <img src={xIcon} alt="X" className="h-6 w-6 mr-4" />
                <span className="avant-book text-[#FFF7DC] text-sm">
                  Leave jewelry in humid or wet places.
                </span>
              </li>
              <li className="flex items-center">
                <img src={xIcon} alt="X" className="h-6 w-6 mr-4" />
                <span className="avant-book text-[#FFF7DC] text-sm">
                  Toss them together in a pouch or drawer.
                </span>
              </li>
              <li className="flex items-center">
                <img src={xIcon} alt="X" className="h-6 w-6 mr-4" />
                <span className="avant-book text-[#FFF7DC] text-sm">
                  Use harsh chemicals or rough brushes.
                </span>
              </li>
              <li className="flex items-center">
                <img src={xIcon} alt="X" className="h-6 w-6 mr-4" />
                <span className="avant-book text-[#FFF7DC] text-sm">
                  Mix different pieces together.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Desktop Jewelry Care */}
      <div className="hidden md:flex flex-col min-h-screen overflow-hidden">
        {/* model image */}
        <div
          className="relative w-full bg-cover bg-center jewelrycare-bg-fixed"
          style={{
            backgroundImage: `url(${jewelrycareBG})`,
            minHeight: "810px",
            marginTop: "96px",
          }}
        >
          {/* title*/}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#FFF7DC] px-6"
            style={{ top: "50%", transform: "translateY(-110%)" }}
          >
            <h1 className="font-bold bebas" style={{ fontSize: "5.5rem" }}>
              JEWELRY CARE
            </h1>
            <p
              className="avant"
              style={{
                top: "50%",
                transform: "translateY(-30%)",
                fontSize: "1.25rem",
              }}
            >
              Even Rebels know how to treat their treasures right.
            </p>
          </div>

          {/* content boxes */}
          <div
            className="absolute inset-0 flex flex-col md:flex-row justify-center items-start text-[#FFF7DC] px-6"
            style={{ top: "50%", transform: "translateY(-30%)" }}
          >
            {/* gentle cleanse */}
            <div
              className="flex flex-col text-left mx-4 mb-8 md:mb-0 p-8"
              style={{
                backgroundColor: "rgba(24, 24, 24, 0.7)",
                borderRadius: "16px",
                width: "420px",
                height: "300px",
              }}
            >
              <img
                src={gentleCleanseIcon}
                alt="Gentle Cleanse"
                className="h-12 w-12 mb-6"
              />
              <h3 className="text-2xl font-bold avant-demi mb-2">
                GENTLE CLEANSE
              </h3>
              <p className="text-md avant mt-4">
                Dip a{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  soft cloth
                </span>{" "}
                or{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  microfiber cloth
                </span>{" "}
                in{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  warm water
                </span>{" "}
                and{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  gentle soap
                </span>{" "}
                combination. Use this to clean your jewelry. Make sure to clean{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>all</span>{" "}
                sides.
              </p>
            </div>

            {/* rinse off */}
            <div
              className="flex flex-col text-left mx-4 mb-8 md:mb-0 p-8"
              style={{
                backgroundColor: "rgba(24, 24, 24, 0.7)",
                borderRadius: "16px",
                width: "420px",
                height: "300px",
              }}
            >
              <img
                src={rinseOffIcon}
                alt="Rinse Off"
                className="h-12 w-12 mb-6"
              />
              <h3 className="text-2xl font-bold avant-demi mb-2">RINSE OFF</h3>
              <p className="text-md avant mt-4">
                To rinse off, use{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  soft cloth
                </span>{" "}
                or{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  microfiber cloth
                </span>{" "}
                dipped in clean water. Wipe off any soap residue until jewelry
                is polished.
              </p>
            </div>

            {/* dry & air */}
            <div
              className="flex flex-col text-left mx-4 p-8"
              style={{
                backgroundColor: "rgba(24, 24, 24, 0.7)",
                borderRadius: "16px",
                width: "420px",
                height: "300px",
              }}
            >
              <img
                src={dryAirIcon}
                alt="Dry & Air"
                className="h-12 w-12 mb-6"
              />
              <h3 className="text-2xl font-bold avant-demi mb-2">DRY & AIR</h3>
              <p className="text-md avant mt-4">
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>Dry</span>{" "}
                jewelry with{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  soft cloth
                </span>{" "}
                or{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  microfiber cloth
                </span>{" "}
                and <span style={{ textShadow: "0 0 5px #FFF7DC" }}>leave</span>{" "}
                to{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>air dry</span>{" "}
                on a{" "}
                <span style={{ textShadow: "0 0 5px #FFF7DC" }}>
                  cool dry place.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* do's and dont's section */}
        <div className="flex flex-row w-full items-start">
          {/* do */}
          <div
            className="w-1/2 flex flex-col items-center justify-center px-12 py-16"
            style={{
              backgroundColor: "rgba(126,123,123,0.22)",
              height: "800px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              className="avant-demi"
              style={{
                fontSize: "2.7rem",
                fontWeight: 700,
                color: "#FFF7DC",
                marginBottom: "40px",
                textAlign: "center",
                letterSpacing: "1px",
                width: "100%",
              }}
            >
              DO
            </h3>
            <ul className="flex flex-col items-start w-3/4">
              <li className="flex items-center mb-8">
                <img src={checkIcon} alt="Check" className="h-8 w-8 mr-5" />
                <span
                  className="avant"
                  style={{
                    color: "#FFF7DC",
                    fontSize: "1.55rem",
                    textAlign: "left",
                  }}
                >
                  Store jewelry in a clean, dry box.
                </span>
              </li>
              <li className="flex items-center mb-8">
                <img src={checkIcon} alt="Check" className="h-8 w-8 mr-5" />
                <span
                  className="avant"
                  style={{
                    color: "#FFF7DC",
                    fontSize: "1.55rem",
                    textAlign: "left",
                  }}
                >
                  Hang necklaces to prevent tangling.
                </span>
              </li>
              <li className="flex items-center mb-8">
                <img src={checkIcon} alt="Check" className="h-8 w-8 mr-5" />
                <span
                  className="avant"
                  style={{
                    color: "#FFF7DC",
                    fontSize: "1.55rem",
                    textAlign: "left",
                  }}
                >
                  Clean your pieces regularly with a soft cloth.
                </span>
              </li>
              <li className="flex items-center">
                <img src={checkIcon} alt="Check" className="h-8 w-8 mr-5" />
                <span
                  className="avant"
                  style={{
                    color: "#FFF7DC",
                    fontSize: "1.55rem",
                    textAlign: "left",
                  }}
                >
                  Use individual pouches for each item.
                </span>
              </li>
            </ul>
          </div>

          {/* don't */}
          <div
            className="w-1/2 flex flex-col items-center justify-center px-12 py-16"
            style={{
              height: "800px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              className="avant-demi"
              style={{
                fontSize: "2.7rem",
                fontWeight: 700,
                color: "#FFF7DC",
                marginBottom: "40px",
                textAlign: "center",
                letterSpacing: "1px",
                width: "100%",
              }}
            >
              DON'T
            </h3>
            <ul className="flex flex-col items-start w-3/4">
              <li className="flex items-center mb-8">
                <img src={xIcon} alt="X" className="h-8 w-8 mr-5" />
                <span
                  className="avant"
                  style={{
                    color: "#FFF7DC",
                    fontSize: "1.55rem",
                    textAlign: "left",
                  }}
                >
                  Leave jewelry in humid or wet places.
                </span>
              </li>
              <li className="flex items-center mb-8">
                <img src={xIcon} alt="X" className="h-8 w-8 mr-5" />
                <span
                  className="avant"
                  style={{
                    color: "#FFF7DC",
                    fontSize: "1.55rem",
                    textAlign: "left",
                  }}
                >
                  Toss them together in a pouch or drawer.
                </span>
              </li>
              <li className="flex items-center mb-8">
                <img src={xIcon} alt="X" className="h-8 w-8 mr-5" />
                <span
                  className="avant"
                  style={{
                    color: "#FFF7DC",
                    fontSize: "1.55rem",
                    textAlign: "left",
                  }}
                >
                  Use harsh chemicals or rough brushes.
                </span>
              </li>
              <li className="flex items-center">
                <img src={xIcon} alt="X" className="h-8 w-8 mr-5" />
                <span
                  className="avant"
                  style={{
                    color: "#FFF7DC",
                    fontSize: "1.55rem",
                    textAlign: "left",
                  }}
                >
                  Mix different pieces together.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JewelryCare;
