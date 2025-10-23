import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { 
    Friden, 
    Odyssey, 
    CheckIcon, 
    customerProf
} from '../../../assets/index.js';


const reviewData = {
  orderId: '38940123',
  requestId: '7421424523',
  items: [
    {
      name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
      variant: 'ODYSSEY',
      price: 590,
      quantity: 1,
      image: Odyssey,
    },
    {
      name: 'Clash Collection Necklaces (Elegant Pendant Jewelry)',
      variant: 'FRIDEN',
      price: 590,
      quantity: 2,
      image: Friden,
    },
  ],
  refundAmount: 590,
  actualAmount: 590,
  refundTo: 'GCash',
  reason: 'Item is Damaged',
  message: 'The item I received is damaged and not in usable condition. Please process my refund as soon as possible. I have attached photos of the damage as proof. Thank you.',
  images: [customerProf, customerProf, customerProf, customerProf],
};

const reviewSteps = [
  { label: "Review in Progress", status: "done" },
  { label: "Return Item", status: "ongoing" },
  { label: "Item Validation", status: "pending" },
  { label: "Refunded", status: "pending" },
];

const ReviewDetailsDesktop = () => (
  <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0">
    <div className="bebas cream-text text-center text-7xl pt-40 mb-15">RETURN/REFUND DETAILS</div>
    <div className="flex items-center justify-between px-12 pb-2">
      <div className="avantbold cream-text text-2xl">ORDER ID : #{reviewData.orderId}</div>
      <div className="avantbold cream-text text-2xl">REQUEST ID : {reviewData.requestId}</div>
    </div>
    {/* Horizontal Line */}
    <div className="w-full px-12 mb-14">
      <div className="h-[4px] bg-[#FFF7DC] w-full" />
    </div>
    {/* Progress Bar */}
    <div className="w-full flex flex-col items-center mb-20">
      <div className="grid grid-cols-4 gap-8 w-full max-w-[1000px] items-center relative">
        {/* Step 1 */}
        <div className="flex items-center justify-center relative">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFF7DC]">
              <img src={CheckIcon} alt="check" className="w-4 h-4" />
            </div>
          </div>
          {/* Connector */}
          <div className="absolute top-1/2 left-1/2 right-[-60%] h-1 bg-[#FFF7DC] -translate-y-1/2 z-0"></div>
        </div>
        {/* Step 2 */}
        <div className="flex items-center justify-center relative">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-[#FFF7DC] border-4 border-[#000000] flex items-center justify-center">
              <img src={CheckIcon} alt="check" className="w-5 h-5" />
            </div>
          </div>
          {/* Connector */}
          <div className="absolute top-1/2 left-1/2 right-[-60%] h-1 bg-[#FFF7DC] -translate-y-1/2 z-0"></div>
        </div>
        {/* Step 3 */}
        <div className="flex items-center justify-center relative">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#959595]"></div>
          </div>
          {/* Connector */}
          <div className="absolute top-1/2 left-1/2 right-[-60%] h-1 bg-[#959595] -translate-y-1/2 z-0"></div>
        </div>
        {/* Step 4 */}
        <div className="flex items-center justify-center relative">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#959595]"></div>
          </div>
        </div>
      </div>
      {/* Labels Row */}
      <div className="grid grid-cols-4 gap-8 w-full max-w-[1000px] mt-1 text-md text-center avantbold">
        {reviewSteps.map((step, idx) => (
          <span key={idx + "-label"} className={step.status === "pending" ? "text-[#959595]" : "cream-text"}>
            {step.label}
          </span>
        ))}
      </div>
    </div>
    {/* Details */}
    <div className="flex justify-center w-full">
      <div className="grid grid-cols-[370px_1px_1fr] gap-0 max-w-[1000px] w-full items-stretch">
        {/* Product List (left) */}
        <div className="flex flex-col gap-8">
          {reviewData.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 mb-2">
              <img src={item.image} alt={item.variant} className="w-24 h-24 object-cover rounded-md" />
              <div>
                <div className="avantbold cream-text text-lg">{item.name}</div>
                <div className="bebas cream-text text-md" style={{color:'#959595'}}>{item.variant} - ₱ {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                <div className="avant cream-text text-md" style={{color:'#959595'}}>Quantity: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Vertical Line */}
        <div className="self-stretch flex items-stretch mb-9">
          <div className="w-[2px] bg-[#FFF7DC] h-full" />
        </div>
        {/* Details (right) */}
        <div className="flex flex-col gap-4 pl-10">
          <div className="flex justify-between items-start gap-8">
            <div>
              <div className="avantbold cream-text text-md mb-1">Refund Amount: <span className="avant text-md">₱ {reviewData.refundAmount.toLocaleString(undefined, {minimumFractionDigits:2})}</span></div>
              <div className="avantbold cream-text text-md mb-1">Actual Refund Amount: <span className="avant text-md">₱ {reviewData.actualAmount.toLocaleString(undefined, {minimumFractionDigits:2})}</span></div>
            </div>
            <div>
              <div className="avantbold cream-text text-md mb-1">Refund to: <span className="avant">{reviewData.refundTo}</span></div>
            </div>
          </div>
          <div className="avantbold cream-text text-md mt-2">Reason: <span className="avant text-md">{reviewData.reason}</span></div>
          <div className="avant cream-text text-md mt-2">{reviewData.message}</div>
          <div className="flex gap-2 mt-2">
            {reviewData.images.map((img, idx) => (
              <img key={idx} src={img} alt={`proof-${idx}`} className="w-16 h-16 object-cover rounded-md border border-[#FFF7DC] mb-10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReviewDetailsMobile = () => (
  <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4">
    <div className="bebas cream-text text-center text-4xl mt-25 mb-2">RETURN/REFUND DETAILS</div>
    {/* Horizontal Line */}
    <div className="w-full mb-4">
      <div className="h-[2px] bg-[#FFF7DC] w-full" />
    </div>
    <div className="flex flex-col mb-6">
      <span className="avantbold cream-text text-sm">ORDER ID : #{reviewData.orderId}</span>
      <span className="avantbold cream-text text-sm">REQUEST ID : {reviewData.requestId}</span>
    </div>
    
    {/* Progress Bar */}
    <div className="flex flex-row w-full mt-2 mb-6 px-6">
      <div className="flex flex-col items-center">
        {reviewSteps.map((step, idx) => {
          // Circle styles
          let circleClass = "flex items-center justify-center rounded-full border-2";
          let iconSize = "w-3 h-3";
          let bgColor = "#FFF7DC";
          let borderColor = "#FFF7DC";
          let circleWidth = "w-6 h-6";
          if (step.status === "ongoing") {
            borderColor = "#000000";
            circleClass += " border-3";
            circleWidth = "w-7 h-7";
            iconSize = "w-3 h-3";
          } else if (step.status === "pending") {
            bgColor = "#1F1F21";
            borderColor = "#FFF7DC";
          }
          let nextLineColor = step.status === "done" ? "bg-[#FFF7DC]" : "bg-[#959595]";
          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <div className={`${circleClass} bg-[${bgColor}] border-[${borderColor}] ${circleWidth}`}>
                  <img src={CheckIcon} alt={step.label} className={iconSize} />
                </div>
                {idx < reviewSteps.length - 1 && (
                  <div className={`w-1 h-12 ${nextLineColor} mt-1`} />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex flex-col ml-4 py-1 h-full">
        {reviewSteps.map((step, idx) => {
          const textColor = step.status === "pending" ? "text-[#959595]" : step.status === "ongoing" ? "text-[#FFF7DC]" : "text-[#FFF7DC]";
          // Manually adjust the label
          const marginClass =
            idx === 0 ? "mt-1" :
            idx === 1 ? "mt-14" :
            idx === 2 ? "mt-15" :
            idx === 3 ? "mt-15" : "";
          return (
            <div key={idx} className={`flex items-center ${marginClass}`}>
              <span className={`avantbold text-sm leading-tight ${textColor}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
    {/* Details */}
    <div>
      {reviewData.items.map((item, idx) => (
        <div key={idx} className="flex gap-2 mb-4">
          <img src={item.image} alt={item.variant} className="w-20 h-20 object-cover rounded-md" />
          <div>
            <div className="avantbold cream-text text-sm">
              <span className="block md:inline">
                {item.name.replace(' (Elegant Pendant Jewelry)', '')}
                <br className="md:hidden" />
                (Elegant Pendant Jewelry)
              </span>
            </div>
            <div className="bebas cream-text text-xs mt-2" style={{color: '#959595'}}>{item.variant} - ₱ {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            <div className="avant cream-text text-xs" style={{color: '#959595'}}>Quantity: {item.quantity}</div>
          </div>
        </div>
      ))}
      <div className="avantbold cream-text text-sm mt-2">Refund Amount: <span className="avant"> ₱ {reviewData.refundAmount.toLocaleString(undefined, {minimumFractionDigits:2})}</span></div>
      <div className="avantbold cream-text text-sm">Actual Refund Amount: <span className="avant"> ₱ {reviewData.actualAmount.toLocaleString(undefined, {minimumFractionDigits:2})}</span></div>
      <div className="avantbold cream-text text-sm">Return to: <span className="avant">{reviewData.refundTo}</span></div>
      <div className="avantbold cream-text text-sm mt-6">Reason: <span className="avant">{reviewData.reason}</span></div>
      <div className="avant cream-text text-sm mt-2">{reviewData.message}</div>
      <div className="flex gap-2 mt-2 flex-wrap">
        {reviewData.images.map((img, idx) => (
          <img key={idx} src={img} alt={`proof-${idx}`} className="w-12 h-12 object-cover rounded-md border border-[#FFF7DC] mt-3 mb-7" />
        ))}
      </div>
    </div>
  </div>
);

const ReviewDetails = () => (
  <Layout full>
    <ReviewDetailsDesktop />
    <ReviewDetailsMobile />
  </Layout>
);

export default ReviewDetails;