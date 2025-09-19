import React, { useRef, useEffect } from "react";
import Layout from "../../components/Layout";
import {
  ourstoryFirst,
  ourstorySecond,
  ourstoryThird,
  ourstoryFourth,
  ourstoryFirstMobile,
  ourstorySecondMobile,
  ourstoryThirdMobile,
  ourstoryFourthMobile,
} from "../../assets/index.js";

// Custom hook for scroll-based fade-in animation
const useScrollFadeIn = (duration = 0.7, delay = 0) => {
  const dom = useRef();
  useEffect(() => {
    const el = dom.current;
    if (!el) return;
    // Animation triggers when element is scrolled into view
    const onScroll = () => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.style.transition = `all ${duration}s cubic-bezier(0,0,0.2,1) ${delay}s`;
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // Initial check
    return () => window.removeEventListener("scroll", onScroll);
  }, [duration, delay]);
  // Initial style for fade-in effect
  return {
    ref: dom,
    style: { opacity: 0, transform: "translateY(40px)" },
  };
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

// MOBILE LAYOUT COMPONENTS
const OurStoryTitleSectionMobile = () => {
  const fadeProps = useScrollFadeIn(0.7, 0);
  return (
    <div
      className="min-h-[480px] mt-0 bg-cover bg-center flex items-center justify-center relative w-full overflow-hidden"
      style={{ backgroundImage: `url(${ourstoryFirstMobile})` }}
    >
      <div
        ref={fadeProps.ref}
        className="text-center m-0 relative z-[2] w-full"
        style={fadeProps.style}
      >
        <div className="bebas text-[#FFF7DC] text-[3.2rem] tracking-[2px] mb-2 whitespace-nowrap text-center">
          OUR STORY
        </div>
      </div>
    </div>
  );
};

const SectionMobile = ({ image, title, description, idx }) => {
  // alignment ng second to fourth image
  let bgPosition = 'center';
  if (idx === 1) bgPosition = 'right';
  else if (idx === 2) bgPosition = 'left';
  else if (idx === 3) bgPosition = 'right';
  // title and description part (second to fourth)
  let contentClass = "relative z-[2] rounded-[18px] m-[0_1rem_1.5rem_1rem] p-[1.2rem_1.2rem_2.2rem_1.2rem] text-left min-w-0 max-w-full";
  let sectionClass = "min-h-[480px] p-0 flex flex-col items-start justify-end w-full relative overflow-hidden";
  if (idx === 1) {
    sectionClass = "min-h-[480px] p-0 flex flex-col items-start justify-start w-full relative overflow-hidden leading-tight";
    contentClass = "relative z-[2] rounded-[18px] m-[0_1rem_1.5rem_1rem] p-[1.2rem_1.2rem_2.2rem_1.2rem] text-left min-w-0 max-w-[50%] mt-[8.5rem]";
  }
  if (idx === 2) {
    sectionClass = "min-h-[480px] p-0 flex flex-col items-start justify-end w-full relative overflow-hidden";
    contentClass = "relative z-[2] rounded-[18px] p-[1.2rem_1.2rem_2.2rem_1.2rem] text-left min-w-0 max-w-full ml-[11rem] mb-[15.5rem]";
  }
  if (idx === 3) {
    sectionClass = "min-h-[480px] p-0 flex flex-col items-start justify-end w-full relative overflow-hidden";
    contentClass = "relative z-[2] rounded-[18px] p-[1.2rem_1.2rem_2.2rem_1.2rem] text-left min-w-0 max-w-[45%] mb-[15.5rem]";
  }

  const fadeProps = useScrollFadeIn(0.7, idx * 0.2);
  // main content sa lahat ng title and description and (second to fourth)
  return (
    <div
      className={sectionClass}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: bgPosition,
      }}
    >
      <div
        ref={fadeProps.ref}
        className={contentClass}
        style={fadeProps.style}
      >
        <div className="bebas text-[#FFF7DC] text-[1.6rem] tracking-[2px] mb-[0.15rem]">
          {title}
        </div>
        {description && (
          <div className="avant text-[#FFF7DC] text-[0.9rem] font-light leading-[1.1]">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

// DESKTOP LAYOUT COMPONENTS
const OurStoryTitleSectionDesktop = () => {
  const fadeProps = useScrollFadeIn(0.7, 0);
  return (
    <div
      className="min-h-[820px] bg-cover bg-center flex items-center justify-center relative w-full overflow-hidden mt-0"
      style={{ backgroundImage: `url(${ourstoryFirst})` }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: 'rgba(0,0,0,0.11)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        ref={fadeProps.ref}
        className="text-center m-0 mx-auto relative z-[2] w-auto"
        style={fadeProps.style}
      >
        <div className="bebas text-[#FFF7DC] text-[6.5rem] tracking-[2px] mb-2 whitespace-nowrap">
          OUR STORY
        </div>
      </div>
    </div>
  );
};

const SectionDesktop = ({
  image, title, description, align, style, idx, marginLeft, marginTop,
}) => {
  const fadeProps = useScrollFadeIn(0.7, idx * 0.2);
  let overlayBg = 'rgba(0,0,0,0)';
  if (idx === 1) overlayBg = 'rgba(0,0,0,0.61)';
  else if (idx === 2) overlayBg = 'rgba(0,0,0,0.2)';
  return (
    <div
      className={`bg-cover bg-center flex w-full relative overflow-hidden`}
      style={{
        ...style,
        backgroundImage: `url(${image})`,
        alignItems: align === "top" ? "flex-start" : "center",
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: overlayBg,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        ref={fadeProps.ref}
        className={`relative z-[2] p-[1.5rem_2rem]`}
        style={{
          ...fadeProps.style,
          textAlign: align === 'center' ? 'center' : 'left',
          marginLeft: marginLeft || (align === 'center' ? '0 auto' : '2.5rem'),
          marginTop: marginTop || (align === "top" ? "4.5rem" : align === "center" ? "150px" : "0"),
          minWidth: '620px',
          maxWidth: '420px',
        }}
      >
        <div className="bebas text-[#FFF7DC] text-[3.5rem] tracking-[2px] mb-[-0.5rem]">
          {title}
        </div>
        {description && (
          <div className="avant text-[#FFF7DC] text-[1.5rem] font-light max-w-[700px]">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

// MAIN PAGE COMPONENT
export default function OurStory() {
  const isMobile = useIsMobile();
  return (
    <Layout full>
      <div className="w-full min-h-screen bg-[#1a1a1a]">
        {isMobile ? (
          <>
            <OurStoryTitleSectionMobile />
            <SectionMobile
              image={ourstorySecondMobile}
              title="WHERE IT ALL STARTED?"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              idx={1}
            />
            <SectionMobile
              image={ourstoryThirdMobile}
              title="MISSION"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              idx={2}
            />
            <SectionMobile
              image={ourstoryFourthMobile}
              title="VISION"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              maxWidth="70%"
              idx={3}
            />
          </>
        ) : (
          <>
            <OurStoryTitleSectionDesktop />
            <SectionDesktop
              image={ourstorySecond}
              title="WHERE IT ALL STARTED?"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              align="left"
              style={{ minHeight: "820px" }}
              idx={1}
            />
            <SectionDesktop
              image={ourstoryThird}
              title="MISSION"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              align="left"
              style={{ minHeight: "900px" }}
              idx={2}
              marginLeft="61rem"
              marginTop="-450px"
            />
            <SectionDesktop
              image={ourstoryFourth}
              title="VISION"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              align="top"
              style={{ minHeight: "820px" }}
              idx={3}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
