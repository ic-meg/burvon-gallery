import React, { useRef, useState, useEffect } from "react";
import './CustomerReviews.css'
import Layout from "../../components/Layout";
import {
    customerBG,
    customerBGMobile,
    customerProf,
} from '../../assets/index.js';

const reviews = [
	{
		name: "GIULIANI",
		collection: "Friden (Clash Collection)",
		rating: 4,
		text: "Absolutely love how it looks and feels. Packaging was stunning too!",
		images: [customerProf, customerProf],
	},
	{
		name: "LEY",
		collection: "Friden (Clash Collection)",
		rating: 5,
		text: "Absolutely love how it looks and feels. Packaging was stunning too!",
		images: [customerProf, customerProf],
	},
	{
		name: "MEG",
		collection: "Friden (Clash Collection)",
		rating: 5,
		text: "Absolutely love how it looks and feels. Packaging was stunning too!",
		images: [customerProf, customerProf],
	},
	{
		name: "ALEX",
		collection: "Classic Collection",
		rating: 3,
		text: "Nice quality and fast shipping!",
		images: [customerProf, customerProf],
	},
	{
		name: "MARIA",
		collection: "LoveLang Collection",
		rating: 5,
		text: "Beautiful packaging and product!",
		images: [customerProf, customerProf],
	},
];

// star ratings
const Star = ({ filled }) => (
	<svg
		className="w-5 h-5"
		fill={filled ? "#FFF7DC" : "none"}
		stroke="#FFF7DC"
		strokeWidth="1.5"
		viewBox="0 0 20 20"
	>
		<polygon points="10,2 12.59,7.36 18.51,7.97 14,12.14 15.18,18.02 10,15.1 4.82,18.02 6,12.14 1.49,7.97 7.41,7.36" />
	</svg>
);

// arrows and dots function desktop
export default function CustomerReviews() {
    const scrollRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setAtStart(el.scrollLeft <= 20);
        setAtEnd(el.scrollLeft + el.offsetWidth >= el.scrollWidth - 2);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener("scroll", checkScroll);
        return () => el.removeEventListener("scroll", checkScroll);
    }, []);

    const scrollLeft = () => {
        const el = scrollRef.current;
        if (el) {
            el.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        const el = scrollRef.current;
        if (el) {
            el.scrollBy({ left: 400, behavior: "smooth" });
        }
    };

    return (
        <Layout>
            {/* Desktop Customer Reviews */}
            <div className="hidden md:block">

                {/* model image and title */}
                <div
                    className="relative left-1/2 -translate-x-1/2 w-screen"
                    style={{ height: "490px" }}
                >
                    <img
                        src={customerBG}
                        alt="Customer BG"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: "left" }}
                    />
                    <div className="absolute top-0 right-40 h-full flex items-center">
                        <h1
                            className="leading-none bebas"
                            style={{
                                color: "#FFF7DC",
                                textAlign: "right",
                                letterSpacing: "2px",
                                fontSize: "110px",
                            }}
                        >
                            CUSTOMER
                            <br />
                            REVIEWS
                        </h1>
                    </div>
                </div>
                {/* subtitle */}
                <div className="text-center mt-25 mb-25">
                    <h2
                        className="font-normal tracking-wide bebas"
                        style={{
                            color: "#FFF7DC",
                            letterSpacing: "1px",
                            fontSize: "40px",
                        }}
                    >
                        REAL REVIEWS FROM REAL REBELS
                    </h2>
                </div>
                
                {/* carousel arrows and reviewers box */}
                <div className="w-full flex items-center justify-center mt-10 mb-23">

                    {/* left arrow */}
                    {!atStart && (
                        <button
                            onClick={scrollLeft}
                            className="flex items-center justify-center mr-2"
                            aria-label="Previous"
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                        >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M20 8L12 16L20 24" stroke="#FFF7DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}

                    {/* scrollable function and reviewers boxes */}
                    <div
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-scroll scrollbar-hide"
                        style={{
                            scrollSnapType: "x mandatory",
                            paddingBottom: "24px",
                            width: "80vw",
                            paddingLeft: "0px",
                            marginLeft: "0px",
                            marginRight: "0px",
                        }}
                    >
                        {reviews.map((review, idx) => (
                            <div
                                key={idx}
                                className="bg-[#181818] rounded-xl shadow-lg p-6 min-w-[350px] max-w-[400px] flex flex-col items-start avant"
                                style={{
                                    color: "#FFF7DC",
                                    scrollSnapAlign: "start",
                                }}
                            >
                                {/* name and stars review alignment */}
                                <div className="flex w-full items-center justify-between mb-1">
                                    <span className="bebas" style={{ fontSize: "18px", letterSpacing: "1px", color: "#FFF7DC" }}>
                                        {review.name}
                                    </span>
                                    <span className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} filled={i < review.rating} />
                                        ))}
                                    </span>
                                </div>
                                <div className="mb-2 avant" style={{ fontSize: "15px", color: "#FFF7DC" }}>
                                    {review.collection}
                                </div>
                                <div className="mb-4 avant" style={{ color: "#FFF7DC" }}>
                                    "{review.text}"
                                </div>
                                <div className="flex gap-2">
                                    {review.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt="customer"
                                            className="w-14 h-14 object-cover border-2 border-white rounded-[5px]"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* right arrow */}
                    {!atEnd && (
                        <button
                            onClick={scrollRight}
                            className="flex items-center justify-center ml-2"
                            aria-label="Next"
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                        >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M12 8L20 16L12 24" stroke="#FFF7DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Customer Reviews */}
            <div className="block md:hidden">
                <div className="relative left-1/2 -translate-x-1/2 w-screen" style={{ height: "320px" }}>

                    {/* model image */}
                    <img
                        src={customerBGMobile}
                        alt="Customer BG Mobile"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        style={{ right: 0 }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <h1
                            className="bebas"
                            style={{
                                color: "#FFF7DC",
                                textAlign: "center",
                                letterSpacing: "2px",
                                fontSize: "44px",
                                lineHeight: "1",
                                marginTop: "12px",
                            }}
                        >
                            CUSTOMER REVIEWS
                        </h1>
                    </div>
                </div>
                <div className="text-center mt-9 mb-2">
                    <h2
                        className="bebas"
                        style={{
                            color: "#FFF7DC",
                            letterSpacing: "1px",
                            fontSize: "29px",
                        }}
                    >
                        REAL REVIEWS FROM REAL REBELS
                    </h2>
                </div>
                {/* Mobile carousel/cards layout here */}
                <MobileCarousel reviews={reviews} />
            </div>
        </Layout>
    );
}

// arrows and dots function mobile
function MobileCarousel({ reviews }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const touchStartX = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveIdx((prev) => (prev + 1) % reviews.length);
        }, 4000);
        return () => clearTimeout(timer);
    }, [activeIdx, reviews.length]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (deltaX > 50) {
            setActiveIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
        } else if (deltaX < -50) {
            setActiveIdx((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
        }
        touchStartX.current = null;
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div
                className="w-full flex justify-center items-center"
                style={{ minHeight: "260px", position: "relative" }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* reviewers box */}
                <div className="bg-[#181818] rounded-xl shadow-2xl p-4 w-[90vw] flex flex-col items-start avant" style={{ color: "#FFF7DC", boxShadow: "0 8px 32px 0 rgba(5, 5, 5, 0.15), 0 1.5px 8px 0 rgba(0,0,0,0.75)" }}>
                    <div className="flex w-full items-center justify-between mb-1">
                        <span className="bebas" style={{ fontSize: "16px", letterSpacing: "1px", color: "#FFF7DC", textAlign: "left" }}>
                            {reviews[activeIdx].name}
                        </span>
                        <span className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} filled={i < reviews[activeIdx].rating} />
                            ))}
                        </span>
                    </div>
                    <div className="mb-2 avant w-full" style={{ fontSize: "13px", color: "#FFF7DC", textAlign: "left" }}>
                        {reviews[activeIdx].collection}
                    </div>
                    <div className="mb-4 avant w-full" style={{ color: "#FFF7DC", textAlign: "left" }}>
                        "{reviews[activeIdx].text}"
                    </div>
                    <div className="flex gap-2 justify-start w-full">
                        {reviews[activeIdx].images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt="customer"
                                className="w-12 h-12 object-cover border-2 border-white rounded-[5px]"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* carousel arrows and dots */}
            <div className="flex items-center justify-center mt-4 gap-3">

                {/* left arrow */}
                <button
                    onClick={() => setActiveIdx(activeIdx === 0 ? reviews.length - 1 : activeIdx - 1)}
                    aria-label="Previous"
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                        <path d="M20 8L12 16L20 24" stroke="#FFF7DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* dots */}
                <div className="flex gap-2">
                    {reviews.map((_, idx) => (
                        <span key={idx} className="inline-block">
                            {activeIdx === idx ? (
                                // filled dot when active
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        display: "inline-block",
                                        background: "#FFF7DC",
                                        border: "2px solid #FFF7DC"
                                    }}
                                />
                            ) : (
                                // outlined dot when inactive
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        display: "inline-block",
                                        background: "transparent",
                                        border: "2px solid #FFF7DC"
                                    }}
                                />
                            )}
                        </span>
                    ))}
                </div>

                {/* right arrow */}
                <button
                    onClick={() => setActiveIdx(activeIdx === reviews.length - 1 ? 0 : activeIdx + 1)}
                    aria-label="Next"
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                        <path d="M12 8L20 16L12 24" stroke="#FFF7DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}