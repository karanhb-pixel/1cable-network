import { useEffect, useState } from "react";

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return(
  <>
    {/* <!-- Footer --> */}
    <footer className="footer-section">
      <p id="copyright-text">
        &copy; {year} 1cable Network. All Rights Reserved.
      </p>
    </footer>
    
  </>
  )
}

export default Footer;
