import React from "react";
import logoImg from "../assets/logo.png";
import OnlineDonation from "../components/OnlineDonation";

const navItems = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "programs", label: "Programs" },
  { key: "children", label: "Children" },
  { key: "team", label: "Team" },
  { key: "reports", label: "Reports" },
  { key: "donate", label: "Donate Now" },
  { key: "admin", label: "Admin" },
];

const impactStats = [
  { value: "24", label: "Education Centers" },
  { value: "400K+", label: "Meals Served" },
  { value: "6,200+", label: "Health Camps" },
  { value: "8,500+", label: "Children Supported" },
];

const publicHighlights = [
  {
    icon: "📚",
    title: "Learning Access",
    text: "Bridge classes, school readiness, digital literacy, and coaching support for at-risk children.",
  },
  {
    icon: "🥗",
    title: "Nutrition and Health",
    text: "Tracked meals, growth monitoring, immunization drives, and child wellness outreach.",
  },
  {
    icon: "🛡️",
    title: "Trust and Compliance",
    text: "Tax certificates, receipts, audit-friendly donation logs, and transparent field reporting.",
  },
];

const programCards = [
  {
    icon: "📘",
    title: "Project JEEVAN",
    tag: "Education",
    text: "Primary schooling support, school kits, learning labs, and re-enrollment assistance.",
  },
  {
    icon: "🍎",
    title: "Nutrition Security",
    tag: "Health",
    text: "Midday meals, vitamin support, and weekly child growth review at each center.",
  },
  {
    icon: "🩺",
    title: "Healthcare & Camps",
    tag: "Care",
    text: "Doctor visits, dental camps, hygiene kits, and medical referrals for families.",
  },
];

const childJourney = [
  "Registration and family verification",
  "Baseline education and health screening",
  "Assigned center, mentor, and duty roster",
  "Monthly progress reporting to donors and staff",
];

const teamRoles = [
  {
    role: "Program Manager",
    desc: "Oversees compliance, budgets, and delivery.",
  },
  {
    role: "Field Coordinator",
    desc: "Tracks attendance, school progress, and family visits.",
  },
  {
    role: "Duty Supervisor",
    desc: "Schedules staff, field work, and center operations.",
  },
  {
    role: "Child Welfare Lead",
    desc: "Monitors medical reviews, nutrition, and safeguarding.",
  },
];

const reportMetrics = [
  { label: "Monthly active children", value: "1,240" },
  { label: "Active employees", value: "38" },
  { label: "Open duty items", value: "19" },
  { label: "Donation receipts issued", value: "2,846" },
];

export default function PublicPortal({ activeTab, onNavigate }) {
  const isActive = (key) => activeTab === key;

  const renderPage = () => {
    if (activeTab === "about") {
      return (
        <section className="page-shell fade-in">
          <div className="section-header section-header-left">
            <h2>About Look4Child</h2>
            <p>
              A child-focused NGO operating community learning hubs, nutrition
              programs, and transparent donation workflows.
            </p>
          </div>
          <div className="portal-grid three-up">
            {publicHighlights.map((item) => (
              <article className="content-card" key={item.title}>
                <div className="content-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "programs") {
      return (
        <section className="page-shell fade-in">
          <div className="section-header section-header-left">
            <h2>Programs and Centers</h2>
            <p>
              Operational modules that can be sold and deployed for other NGOs
              as a working portal.
            </p>
          </div>
          <div className="portal-grid three-up">
            {programCards.map((card) => (
              <article className="program-card" key={card.title}>
                <div className="program-card-media">{card.icon}</div>
                <div className="program-body">
                  <span className="program-tag">{card.tag}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "children") {
      return (
        <section className="page-shell fade-in">
          <div className="section-header section-header-left">
            <h2>Children Details and Support Flow</h2>
            <p>
              Structured onboarding, health review, class mapping, and case
              follow-up for every child.
            </p>
          </div>
          <div className="portal-two-col">
            <div className="content-card large-card">
              <h3>Beneficiary journey</h3>
              <ul className="timeline-list">
                {childJourney.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <div>{step}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="content-card large-card highlight-card">
              <h3>Why this page matters</h3>
              <p>
                This portal can be used to track enrollment, guardian
                information, nutrition flags, and center placement for each
                child in the program.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate("admin")}
              >
                Open Admin Control
              </button>
            </div>
          </div>
        </section>
      );
    }

    if (activeTab === "team") {
      return (
        <section className="page-shell fade-in">
          <div className="section-header section-header-left">
            <h2>Employee Records and Duty Control</h2>
            <p>
              Manage staff profiles, shift duties, and field assignments from
              the admin portal.
            </p>
          </div>
          <div className="portal-grid two-up">
            {teamRoles.map((role) => (
              <article className="content-card" key={role.role}>
                <h3>{role.role}</h3>
                <p>{role.desc}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "reports") {
      return (
        <section className="page-shell fade-in">
          <div className="section-header section-header-left">
            <h2>Transparency Reports</h2>
            <p>
              Useful for donor reporting, board reviews, and NGO compliance
              conversations.
            </p>
          </div>
          <div className="portal-grid four-up">
            {reportMetrics.map((metric) => (
              <article
                className="metric-card compact-metric"
                key={metric.label}
              >
                <p>{metric.label}</p>
                <h3>{metric.value}</h3>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "donate") {
      return (
        <section className="page-shell fade-in">
          <div className="donation-page-container">
            <div className="donation-info">
              <h2>Your support changes everything</h2>
              <p>
                Donations are tracked end-to-end with receipts, tax documents,
                and a clean audit trail.
              </p>
              <ul className="info-bullet-list">
                <li>
                  <span className="info-bullet-icon">✓</span> Secure payment
                  flow with success receipt generation
                </li>
                <li>
                  <span className="info-bullet-icon">✓</span> Automatic
                  certificate download after verification
                </li>
                <li>
                  <span className="info-bullet-icon">✓</span> Donation analytics
                  available in the admin dashboard
                </li>
                <li>
                  <span className="info-bullet-icon">✓</span> Ready to extend
                  into multi-NGO sales deployments
                </li>
              </ul>
              <div className="tax-badge">
                <span className="tax-badge-icon">🛡️</span>
                <div className="tax-badge-text">
                  <h4>Registered and compliant</h4>
                  <p>
                    Tax certificates and receipts are available after every
                    successful contribution.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <OnlineDonation />
            </div>
          </div>
        </section>
      );
    }

    return (
      <>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow-pill">
              NGO donation and operations platform
            </div>
            <h2>
              One portal for donations, children, staff, and field control.
            </h2>
            <p>
              Look4Child now includes a restored navigation layer, multi-page
              NGO experience, and an admin-ready control system for records,
              duties, and program oversight.
            </p>
            <div className="hero-buttons">
              <button
                className="btn btn-primary"
                onClick={() => onNavigate("donate")}
              >
                Support a Child Today
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate("programs")}
              >
                View Programs
              </button>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-backdrop-gradient">
              <div className="glass-panel-accent" />
              <div className="hero-gradient-content">
                <span className="hero-gradient-emoji">📚🎒👦</span>
                <h3>Child welfare at scale</h3>
                <p>
                  Designed for transparent NGO operations and scalable donor
                  management.
                </p>
              </div>
            </div>
            <div className="hero-badge">
              <div className="hero-badge-number">8,500+</div>
              <div className="hero-badge-text">
                Children Empowered <br />& Educated
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          {impactStats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-icon">•</div>
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="portal-grid three-up">
          {publicHighlights.map((item) => (
            <article className="content-card" key={item.title}>
              <div className="content-card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="section-card">
          <div className="section-header section-header-left">
            <h2>Live navigation restored</h2>
            <p>
              The menu now exposes the missing NGO pages instead of hiding the
              portal inside a single screen.
            </p>
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="portal-shell">
      <header className="site-header">
        <div className="nav-wrapper portal-nav-wrapper">
          <button
            className="logo logo-button"
            onClick={() => onNavigate("home")}
          >
            <img
              src={logoImg}
              alt="Look For Child Foundation"
              className="logo-img"
            />
          </button>
          <nav className="main-nav" aria-label="Primary">
            <ul>
              {navItems.map((item) => (
                <li key={item.key}>
                  <button
                    className={`nav-btn ${isActive(item.key) ? "active" : ""} ${item.key === "donate" ? "nav-btn-donate" : ""}`}
                    onClick={() => onNavigate(item.key)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="portal-main">{renderPage()}</main>
    </div>
  );
}
