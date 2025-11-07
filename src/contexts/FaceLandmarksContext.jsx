import { createContext, useContext, useState } from "react";

const FaceLandmarksContext = createContext();

export const FaceLandmarksProvider = ({ children }) => {
  const [faceLandmarks, setFaceLandmarks] = useState(null);

  return (
    <FaceLandmarksContext.Provider value={{ faceLandmarks, setFaceLandmarks }}>
      {children}
    </FaceLandmarksContext.Provider>
  );
};

export const useFaceLandmarks = () => {
  const context = useContext(FaceLandmarksContext);
  if (!context) {
    throw new Error("useFaceLandmarks must be used within FaceLandmarksProvider");
  }
  return context;
};
