import React, { useRef, useEffect } from "react";
import Layout from "../../components/Layout";
import ourstoryFirst from "../../assets/images/ourstory-first.png";
import ourstorySecond from "../../assets/images/ourstory-second.png";
import ourstoryThird from "../../assets/images/ourstory-third.png";
import ourstoryFourth from "../../assets/images/ourstory-fourth.png";
import ourstoryFirstMobile from "../../assets/images/ourstory-first1.png";
import ourstorySecondMobile from "../../assets/images/ourstory-second1.png";
import ourstoryThirdMobile from "../../assets/images/ourstory-third1.png";
import ourstoryFourthMobile from "../../assets/images/ourstory-fourth1.png";

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

// sa desktop to na our story na large title style
const fontTitleLarge = {
  fontFamily: 'Bebas Neue, sans-serif',
  color: '#FFF7DC',
  fontSize: '6.5rem',
  letterSpacing: '2px',
  marginBottom: '0.5rem',
  whiteSpace: 'nowrap',
};

// desktop title style
const fontTitle = {
  fontFamily: 'Bebas Neue, sans-serif',
  color: '#FFF7DC',
  fontSize: '3.5rem',
  letterSpacing: '2px',
  marginBottom: '-0.5rem', // babaan lang if gusto mo magkadikit yung desc tsaka title, taasan if gusto mo mejo hiwalay
};

// desktop description style
const fontDesc = {
  fontFamily: 'AvantGarde Bk BT, AvantGardeBookBT, AVGARDN, sans-serif',
  color: '#FFF7DC',
  fontSize: '1.5rem',
  fontWeight: 300,
  maxWidth: '700px',
};

// same lang sa taas pero mobile layout
const mobileStyles = {
  section: {
    minHeight: "480px",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  content: {
    padding: "1.2rem 1.2rem 2.2rem 1.2rem",
    textAlign: "left",
    minWidth: "0",
    maxWidth: "100%",
    position: "relative",
    zIndex: 2,
    borderRadius: "18px",
    margin: "0 1rem 1.5rem 1rem",
  },
  title: {
    fontFamily: 'Bebas Neue, sans-serif',
    color: '#FFF7DC',
    fontSize: '1.6rem',
    letterSpacing: '2px',
    marginBottom: '0.15rem', // babaan lang if gusto mo magkadikit yung desc tsaka title, taasan if gusto mo mejo hiwalay
  },
  desc: {
    fontFamily: 'AvantGarde Bk BT, AvantGardeBookBT, AVGARDN, sans-serif',
    color: '#FFF7DC',
    fontSize: '1rem',
    fontWeight: 300,
    lineHeight: '1.1',
  },
  largeTitle: {
    fontFamily: 'Bebas Neue, sans-serif',
    color: '#FFF7DC',
    fontSize: '3.2rem',
    letterSpacing: '2px',
    marginBottom: '0.5rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
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
const OurStoryTitleSectionMobile = () => { // nakahiwalay yung image at title sa ourstory-first1 sa mobile
  const fadeProps = useScrollFadeIn(0.7, 0);
  return (
    <div
      style={{
        minHeight: "480px",
        marginTop: "0",
        backgroundImage: `url(${ourstoryFirstMobile})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        ref={fadeProps.ref}
        style={{
          ...fadeProps.style,
          textAlign: 'center',
          margin: "0",
          position: 'relative',
          zIndex: 2,
          width: "100%",
        }}
      >
        <div style={mobileStyles.largeTitle}>OUR STORY</div>
      </div>
    </div>
  );
};

const SectionMobile = ({ image, title, description, idx }) => {
  // position ng image from ourstory second1-fourth1 in mobile
  let bgPosition = 'center';
  if (idx === 1) bgPosition = 'right';
  else if (idx === 2) bgPosition = 'left';
  else if (idx === 3) bgPosition = 'right';

  // content ng mga text from ourstory second1-fourth1, box box yan sila
  let contentStyle = mobileStyles.content;
  let sectionStyle = mobileStyles.section;

  if (idx === 1) {
    sectionStyle = { ...mobileStyles.section, justifyContent: "flex-start" };
    contentStyle = { 
      ...mobileStyles.content, 
      maxWidth: "70%", // taasaan lang if gusto mo i-widen yung buong content
      marginTop: "8.5rem", // babaan lang if gusto mo i-angat yung buong content
    };
  }
  if (idx === 2) {
    sectionStyle = { ...mobileStyles.section, justifyContent: "flex-end" };
    contentStyle = {
      ...mobileStyles.content,
      maxWidth: "100%",
      marginLeft: "11rem", // adjust lang pataas kung gusto i-left
      marginBottom: "15.5rem", // taasan lang kung gusto pa i-angat
    };
  }
  if (idx === 3) {
    sectionStyle = { ...mobileStyles.section, justifyContent: "flex-end" };
    contentStyle = {
      ...mobileStyles.content,
      maxWidth: "60%",
      marginBottom: "15.5rem", // taasan lang kung gusto pa i-angat
    };
  }

  // text animation with fade in sa mobile
  const fadeProps = useScrollFadeIn(0.7, idx * 0.2);

  return (
    <div
      style={{
        ...sectionStyle,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: bgPosition,
      }}
    >
      <div
        ref={fadeProps.ref}
        style={{
          ...contentStyle,
          ...fadeProps.style, // animation style applied to content box
        }}
      >
        <div style={mobileStyles.title}>{title}</div>
        {description && <div style={mobileStyles.desc}>{description}</div>}
      </div>
    </div>
  );
};

// DESKTOP LAYOUT COMPONENTS
const OurStoryTitleSectionDesktop = () => { //hiwalay na image at title sa ourstory-first1 sa desktop
  const fadeProps = useScrollFadeIn(0.7, 0);
  return (
    <div
      style={{
        minHeight: "820px",
        marginTop: "150px",
        backgroundImage: `url(${ourstoryFirst})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        marginTop: '0', // Remove top margin to allow expansion sa taas
        
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.11)',
          zIndex: 1, pointerEvents: 'none',
        }}
      />
      <div
        ref={fadeProps.ref}
        style={{
          ...fadeProps.style,
          textAlign: 'center',
          margin: "0 auto",
          position: 'relative',
          zIndex: 2,
          width: "auto",
        }}
      >
        <div style={fontTitleLarge}>OUR STORY</div>
      </div>
    </div>
  );
};

const SectionDesktop = ({
  image, title, description, align, style, idx, marginLeft, marginTop,
}) => {
  const fadeProps = useScrollFadeIn(0.7, idx * 0.2);
  return (
    <div
      style={{
        ...style,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: align === "top" ? "flex-start" : "center",
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* overlay na black bg sa image  */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: idx === 1
            ? 'rgba(0,0,0,0.61)'
            : idx === 2
            ? 'rgba(0,0,0,0.2)'
            : idx === 3
            ? 'rgba(0,0,0,0)'
            : 'rgba(0,0,0,0)',
          zIndex: 1, pointerEvents: 'none',
        }}
      />
      <div
        ref={fadeProps.ref}
        style={{
          ...fadeProps.style,
          padding: '1.5rem 2rem',
          textAlign: align === 'center' ? 'center' : 'left',
          marginLeft: marginLeft || (align === 'center' ? '0 auto' : '2.5rem'),
          marginTop: marginTop || (align === "top" ? "4.5rem" : align === "center" ? "150px" : "0"),
          minWidth: '620px',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={fontTitle}>{title}</div>
        {description && <div style={fontDesc}>{description}</div>}
      </div>
    </div>
  );
};

// MAIN PAGE COMPONENT
export default function OurStory() {
  const isMobile = useIsMobile();
  return (
    <Layout full>
      <div style={{ width: "100%", minHeight: "100vh", background: "#1a1a1a" }}>
        {/* MOBILE LAYOUT */}
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
              idx={3}
            />
          </>
        ) : (
          <>
            {/* DESKTOP LAYOUT */}
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
              marginLeft="51rem"
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
