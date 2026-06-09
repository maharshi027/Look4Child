import "./footer.css";

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
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>👧</span> Dream Girl Foundation
          </h3>
          <p>
            Dedicated to establishing a protective, healthy, and highly
            supportive social environment that enables girls to acquire skills
            and lead an independent life.
          </p>
          <p className="footer-reg-no">Reg No. S/68593/2010</p>
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
                  onNav?.("work");
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
              <span>📍</span> Sector 9, Gurugram, Haryana - 122001, India
            </li>
            <li>
              <span>✉️</span> contact@dreamgirlfoundation.org.in
            </li>
            <li>
              <span>📞</span> +91-9873001122
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Dream Girl Foundation. All Rights
          Reserved.
        </div>
        <div className="footer-bottom-right">
          Registered under Societies Registration Act XXI of 1860.
        </div>
      </div>
    </footer>
  );
}
