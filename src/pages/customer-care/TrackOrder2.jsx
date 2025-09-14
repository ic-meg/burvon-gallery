import React from "react";
import Layout from "../../components/Layout";
// Example icon imports; replace with real file paths
import {
  Received,
  Received_Done,
  Processed,
  Processed_Done,
  Shipped,
  Arrived,
  CheckIcon,
} from "../../assets/index.js";

const orderTimeline = [
  {
    label: "Order Received",
    date: "March 01, 2025",
    status: "done",
    icon: Received_Done,
  },
  {
    label: "Order Processed",
    date: "March 03, 2025",
    status: "ongoing",
    icon: Processed_Done,
  },
  {
    label: "Package Shipped",
    date: "",
    status: "pending",
    icon: Shipped,
  },
  {
    label: "Package Arrived",
    date: "",
    status: "pending",
    icon: Arrived,
  },
];

// Helper for date colors
const getDateColor = (status) => {
  if (status === "pending") return "text-[#959595]";
  return "text-[#FFF7DC]";
};

const TrackOrder2 = () => (
  <Layout>
    <div className="bg-none text-[#FFF7DC] min-h-screen relative">
      {/* Header */}
<header className="relative text-[#FFF7DC] pt-10">
  {/* Title */}
  <h1 className="font-bold text-4xl md:text-6xl bebas text-center">
    TRACK YOUR ORDER
  </h1>

  {/* Desktop: Order ID + Tracking ABOVE line */}
  <div className="hidden md:flex justify-between items-center w-full px-6 mt-6 avantbold">
    <div className="text-base md:text-xl font-semibold whitespace-nowrap">
      Order ID : <span className="font-bold">#38940123</span>
    </div>
    <div className="text-base md:text-xl font-semibold whitespace-nowrap">
      Tracking Number : <span className="ml-1">7421424523</span>
    </div>
  </div>

  {/* Divider line full width */}
  <div className="w-full h-[3px] bg-[#FFF7DC] mt-6" />

  {/* Mobile: Order ID + Tracking BELOW line */}
  <div className="flex flex-col md:hidden w-full px-2 mt-4 avantbold">
    <div className="text-base font-semibold whitespace-nowrap mb-[2px]">
      Order ID : <span className="font-bold">#38940123</span>
    </div>
    <div className="text-base font-semibold whitespace-nowrap mb-[2px]">
      Tracking Number : <span className="ml-1">7421424523</span>
    </div>
  </div>
</header>



      {/* ==================== DESKTOP TIMELINE ==================== */}
      <section className="hidden md:flex flex-col items-center px-6 md:px-16 max-w-[1280px] mx-auto relative z-10 mt-15">
        {/* Step Boxes */}
        <div className="grid grid-cols-4 gap-8 w-full max-w-[1000px] mb-5">
          {orderTimeline.map((step, idx) => {
            const textColor =
              step.status === "pending" ? "text-[#FFF7DC]" : "text-[#1F1F21]";
            const bg =
              step.status === "done" || step.status === "ongoing"
                ? "bg-[#FFF7DC]"
                : "bg-transparent";
            const border =
              step.status === "ongoing"
                ? "border-4 border-[#000000]"
                : "border-2 border-[#FFF7DC]";

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-full rounded-xl min-h-[64px] flex items-center px-4 py-2 ${bg} ${border}`}
                >
                  <div className="flex items-center">
                    <img
                      src={step.icon}
                      alt={step.label}
                      className="w-9 h-9 mr-2"
                    />
                    <div
                      className={`flex flex-col justify-center leading-tight ${textColor}`}
                    >
                      <span className="avant text-base">
                        {step.label.split(" ")[0]}
                      </span>
                      <span className="avantbold text-lg">
                        {step.label.split(" ")[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circles + Connecting Lines */}
        <div className="grid grid-cols-4 gap-8 w-full max-w-[1000px] items-center relative">
          {orderTimeline.map((step, idx) => {
            const isDoneToOngoing =
              step.status === "done" &&
              orderTimeline[idx + 1] &&
              orderTimeline[idx + 1].status === "ongoing";

            const lineColor =
              step.status === "done" || step.status === "ongoing"
                ? "bg-[#FFF7DC]"
                : "bg-[#959595]";

            return (
              <div key={idx} className="flex items-center justify-center relative">
                {/* Circle */}
                <div className="relative z-10">
                  {step.status === "done" && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFF7DC]">
                      <img src={CheckIcon} alt="check" className="w-4 h-4" />
                    </div>
                  )}
                  {step.status === "ongoing" && (
                    <div className="w-12 h-12 rounded-full bg-[#FFF7DC] border-4 border-[#000000] flex items-center justify-center">
                      <img src={CheckIcon} alt="check" className="w-5 h-5" />
                    </div>
                  )}
                  {step.status === "pending" && (
                    <div className="w-8 h-8 rounded-full bg-[#959595]" />
                  )}
                </div>

                {/* Line */}
                {idx < orderTimeline.length - 1 && (
                  <div
                    className={`absolute top-1/2 left-1/2 right-[-60%] h-1 ${lineColor} -translate-y-1/2 z-0`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-4 gap-8 w-full max-w-[1000px] mt-3 text-lg text-center avant">
          {orderTimeline.map((step, idx) => (
            <span key={idx} className={getDateColor(step.status)}>
              {step.date ? step.date : <span>-</span>}
            </span>
          ))}
        </div>
      </section>

{/* ==================== MOBILE TIMELINE ==================== */}
<section className="block md:hidden w-full mt-10 px-6">
  {orderTimeline.map((step, idx) => {
    // Circle styles
    let circleClass = "flex items-center justify-center rounded-full border-2";
    let iconSize = "w-5 h-5";

    if (step.status === "done") {
      circleClass += " bg-[#FFF7DC] border-[#FFF7DC] w-10 h-10";
    } else if (step.status === "ongoing") {
      circleClass += " bg-[#FFF7DC] border-4 border-[#000000] w-14 h-14";
      iconSize = "w-7 h-7";
    } else {
      circleClass += " bg-[#1F1F21] border-[#FFF7DC] w-10 h-10"; // outlined only
    }

    // Text colors
    const textColor =
      step.status === "pending" ? "text-[#959595]" : "text-[#FFF7DC]";
    const dateColor =
      step.status === "pending" ? "text-[#959595]" : "text-[#FFF7DC]";

    // Line color logic
    let nextLineColor = "bg-[#959595]";
    if (step.status === "done") {
      nextLineColor = "bg-[#FFF7DC]";
    } else if (step.status === "ongoing") {
      // force the line AFTER ongoing to be grey
      nextLineColor = "bg-[#959595]";
    }

    return (
      <div key={idx} className="flex items-start relative mb-8">
        {/* Circle column */}
        <div className="flex flex-col items-center w-14 mr-4 relative">
          {/* Circle */}
          <div className={circleClass}>
            <img src={step.icon} alt={step.label} className={iconSize} />
          </div>

          {/* Vertical line connecting to next circle */}
          {idx < orderTimeline.length - 1 && (
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 w-1 h-[130%] ${nextLineColor}`}
            />
          )}
        </div>

        {/* Label + Date group */}
        <div className="flex flex-col justify-center">
          <span className={`avant text-base leading-tight ${textColor}`}>
            {step.label.split(" ")[0]}
          </span>
          <span className={`avantbold text-lg -mt-1 ${textColor}`}>
            {step.label.split(" ")[1]}
          </span>
          {/* Date always gray (#959595) */}
          <span className="text-sm -mt-1 text-[#959595]">
            {step.date || "-"}
          </span>
        </div>

      </div>
    );
  })}
</section>






    </div>
  </Layout>
);

export default TrackOrder2;
