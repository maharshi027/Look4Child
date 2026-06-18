import "./footer.css";
import logoImg from "../../assets/logo.png";

export default function Footer({ onNav }) {
  // Hide footer on admin dashboard to keep admin full-page
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/admin");

  if (isAdmin) return null;

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-logo-container">
            <img src={logoImg} alt="Look For Child Foundation" className="footer-logo" />
          </div>
          <p>
            Dedicated to establishing a protective, healthy, and highly
            supportive social environment that enables underprivileged children to acquire 
            education, life skills, and lead an independent life.
          </p>
          <p className="footer-reg-no">PAN: AAAAL4939Q | Reg No. S/68593/2010</p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNav?.("home");
                }}
              >
                Home & Statistics
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNav?.("home");
                  setTimeout(() => {
                    document.getElementById("core-programs")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Our Programs
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNav?.("donate");
                }}
              >
                Secure Donation
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNav?.("admin");
                }}
              >
                Internal CMS Console
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact NGO</h3>
          <ul className="footer-contact">
            <li>
              <span>📍</span> Room No.1, Opp. Sarpanch Anant House, Tigra Village, Sec-57, Gurgaon
            </li>
            <li>
              <span>✉️</span> info@look4child.ngo
            </li>
            <li>
              <span>📞</span> +91 98998 18585
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Look For Child Foundation. All Rights
          Reserved.
        </div>
        <div className="footer-bottom-right">
          Registered under Societies Registration Act XXI of 1860.
        </div>
      </div>
    </footer>
  );
}
