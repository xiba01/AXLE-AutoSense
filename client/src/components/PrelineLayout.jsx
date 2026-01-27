import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "preline/preline";

const PrelineLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // This function comes from the preline package import above
    // It re-scans the DOM for dropdowns/modals whenever the route changes
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [location.pathname]);

  return <>{children}</>;
};

export default PrelineLayout;
