import React from 'react'
import Layout from '../../components/Layout'
// Example icon imports (replace these paths with your real icon file paths)
import {
  Received,
  Processed,
  Shipped,
  Arrived,
} from "../../assets/index.js";

const orderSteps = [
  { label: "Order Received", icon: Received, date: "March 01, 2025" },
  { label: "Order Processed", icon: Processed, date: "March 03, 2025" },
  { label: "Package Shipped", icon: Shipped, date: "" },
  { label: "Package Arrived", icon: Arrived, date: "" },
];

const TrackOrder2 = () => {
  return (
    <Layout>
      <div className="bg-[#181818] text-[#FFF7DC] min-h-screen relative">
        {/* Header */}
        <header className="relative py-10 text-[#FFF7DC]">
          {/* Full width container - no max width or padding restriction */}
          <div className="grid grid-cols-3 items-center w-full">
            {/* Left-aligned Order ID */}
            <div className="justify-self-start text-lg md:text-xl font-semibold whitespace-nowrap pl-6">
              Order ID : <b>#38940123</b>
            </div>
            {/* Centered Title */}
            <h1 className="font-bold text-4xl md:text-6xl bebas text-center">
              TRACK YOUR ORDER
            </h1>
            {/* Right-aligned Tracking Number */}
            <div className="justify-self-end text-lg md:text-xl font-semibold flex items-center whitespace-nowrap pr-6">
              Tracking Number :{" "}
              <a href="#" className="text-[#6CB5F3] underline ml-1">
                7421424523
              </a>
              <span className="ml-2">📋</span>
            </div>
          </div>
          {/* Full-width underline */}
          <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#FFF7DC]" />
        </header>

        {/* Timeline */}
        <section className="mt-12 flex flex-col items-center px-8 md:px-16 max-w-[1280px] mx-auto relative z-10">
          <div className="flex gap-12 max-w-[880px] mx-auto w-full">
            {orderSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#23221e] border-2 border-[#f3eedd] rounded-lg w-56 min-h-[110px] flex flex-col items-center justify-center gap-2"
              >
                <img src={step.icon} alt={step.label} className="w-12 h-12" />
                <div className="font-bold text-xl text-center">{step.label}</div>
              </div>
            ))}
          </div>
          {/* Timeline progress bar */}
          <div className="flex items-center mt-9 max-w-[880px] mx-auto w-full">
            {orderSteps.map((_, idx) => (
              <React.Fragment key={idx}>
                <div className="w-10 h-10 bg-[#181818] border-4 border-[#FFF7DC] rounded-full flex items-center justify-center">
                  <span className="text-[#FFF7DC] text-2xl font-bold">✓</span>
                </div>
                {idx < orderSteps.length - 1 && (
                  <div className="bg-[#FFF7DC] h-2 flex-grow mx-8" />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Dates below the timeline */}
          <div className="flex justify-between max-w-[880px] mx-auto w-full mt-5 text-lg px-2">
            <span>{orderSteps[0].date}</span>
            <span>{orderSteps[1].date}</span>
            <span>{/* Empty for shipped date */}</span>
            <span>{/* Empty for arrived date */}</span>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TrackOrder2;