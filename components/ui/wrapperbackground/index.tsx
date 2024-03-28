"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";

const WrapperBackground = ({ children }: { children: React.ReactNode }) => {
  const [selectedCover, setSelectedCover] = useState<string>("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const userCoverBackground =
      typeof window !== "undefined"
        ? (localStorage.getItem("cover-bg") as string)
        : undefined;

    if (userCoverBackground) {
      setSelectedCover(userCoverBackground);
    } else {
      setSelectedCover(
        "https://cdnb.artstation.com/p/assets/images/images/004/656/221/large/chengwei-pan-diana1.jpg?1485328717"
      );
    }
  }, []);

  if (!selectedCover) return null;

  return (
    <div
      className="image-bg"
      style={{
        backgroundImage: isMobile
          ? `url(https://res.cloudinary.com/dw3mwclgk/image/upload/v1711629209/hrwisiiionr1ukmpclrd.png)`
          : `radial-gradient(at center top, 
              rgba(12, 59, 106, 0.4), 
              rgba(3, 16, 30, 0.6), 
              rgba(3, 16, 30, 1), 
              rgba(3, 16, 30, 1), 
              rgba(3, 16, 30, 1)
            ), url(${selectedCover})`,
      }}
    >
      {children}
    </div>
  );
};

export default WrapperBackground;
