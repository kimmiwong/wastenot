import { useEffect, useState } from "react";

const CURRENT_BANNER_VERSION = "1.0";

export default function DevBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissedVersion = localStorage.getItem("devBannerDismissed");
    if (dismissedVersion !== CURRENT_BANNER_VERSION) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("devBannerDismissed", CURRENT_BANNER_VERSION);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        backgroundColor: "orange",
        color: "white",
        padding: "1rem",
        fontSize: "1rem",
        textAlign: "center",
      }}
    >
      <span>
        WasteNot is still in development - features may not work as expected.
        Questions or feedback?{" "}
        <a href="mailto:wastenotkitchen2025@gmail.com" className="underline">
          wastenotkitchen2025@gmail.com
        </a>
      </span>
      <button onClick={handleClose} className="ml-4 font-bold px-2">
        X
      </button>
    </div>
  );
}
