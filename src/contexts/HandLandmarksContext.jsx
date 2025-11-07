import { createContext, useContext, useState } from "react";

const HandLandmarksContext = createContext();

export const HandLandmarksProvider = ({ children }) => {
  const [handLandmarks, setHandLandmarks] = useState(null);

  return (
    <HandLandmarksContext.Provider value={{ handLandmarks, setHandLandmarks }}>
      {children}
    </HandLandmarksContext.Provider>
  );
};

export const useHandLandmarks = () => {
  const context = useContext(HandLandmarksContext);
  if (!context) {
    throw new Error("useHandLandmarks must be used within HandLandmarksProvider");
  }
  return context;
};

