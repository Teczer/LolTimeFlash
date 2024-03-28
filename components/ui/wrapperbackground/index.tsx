"use client";

import { useEffect, useState } from "react";

const WrapperBackground = ({ children }: { children: React.ReactNode }) => {
  const [selectedCover, setSelectedCover] = useState<string>("");

  useEffect(() => {
    const userCoverBackground =
      typeof window !== "undefined"
        ? (localStorage.getItem("cover-bg") as string)
        : undefined;

    if (userCoverBackground) {
      setSelectedCover(userCoverBackground);
    }
  }, [selectedCover]);

  if (!selectedCover) return null;

  return (
    <div
      className="image-bg"
      style={{
        backgroundImage: `radial-gradient(at center top, 
rgba(12, 59, 106, 0.4), 
rgba(3, 16, 30, 0.6), 
rgba(3, 16, 30, 1), 
rgba(3, 16, 30, 1), 
rgba(3, 16, 30, 1)
),url(${selectedCover})`,
      }}
    >
      {children}
    </div>
  );
};

export default WrapperBackground;
