import React from 'react';

const ServerDownError = ({ onRetry, retrying = false }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1F21] bg-opacity-95">
      <div className="max-w-md w-full mx-4 text-center">
        {/* Server icon */}
        <div className="mb-6 flex justify-center">
          <svg
            className="w-20 h-20 text-[#FFF7DC] opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h2 className="bebas text-[#FFF7DC] text-4xl mb-4 tracking-wide">
          SERVER UNAVAILABLE
        </h2>
        <p className="avant text-[#FFF7DC] text-base mb-8 opacity-90 leading-relaxed">
          Server is currently unavailable. Please try again later.
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          disabled={retrying}
          className={`avant px-8 py-3 rounded text-[#1F1F21] font-medium tracking-wide transition-all duration-300 ${
            retrying
              ? 'bg-[#FFF7DC] opacity-70 cursor-not-allowed'
              : 'bg-[#FFF7DC] hover:bg-opacity-90 hover:scale-105 cursor-pointer'
          }`}
        >
          {retrying ? 'RETRYING...' : 'RETRY'}
        </button>
      </div>
    </div>
  );
};

export default ServerDownError;
