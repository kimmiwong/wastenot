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
    <div className="banner">
      <span>
        WasteNot is still in development - features may not work as expected.
        Questions or feedback?{" "}
        <a href="mailto:wastenotkitchen2025@gmail.com" className="email">
          wastenotkitchen2025@gmail.com
        </a>
      </span>
      <button onClick={handleClose}>
        X
      </button>
    </div>
  );
}
