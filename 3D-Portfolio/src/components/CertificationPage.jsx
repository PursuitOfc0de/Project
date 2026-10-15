
import { useState } from "react";

import aimlImage from "../assets/certificates/AIML.png";
import frontendImage from "../assets/certificates/Frontend.jpg";
import cloudImage from "../assets/certificates/NPTEL_CC.png";
import javaImage from "../assets/certificates/Java_FSD.jpg";

const certificates = [
  {
    title: "AIML Internship",
    issuer: "Web_Bocket Software Pvt Ltd.",
    date: "10-08-2026",
    image: aimlImage,
  },

  {
    title: "Cloud Computing",
    issuer: "NPTEL",
    image: cloudImage,
  },
    {
    title: "Frontend Development",
    issuer: "Web_Bocket Software Pvt Ltd.",
    date: "03-07-2025",
    image: frontendImage,
  },
  {
    title: "Java Full Stack Development",
    issuer: "SkillDzire",
    image: javaImage,
  },
];

export default function CertificationsPage({ onBack }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const certificate = certificates[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) =>
      (current - 1 + certificates.length) % certificates.length
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      (current + 1) % certificates.length
    );
  };

  const handleCardMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
    card.style.setProperty("--shine-x", `${x * 100}%`);
    card.style.setProperty("--shine-y", `${y * 100}%`);
  };

  const handleCardLeave = (event) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <section className="certifications-page">
      <header className="certifications-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Portfolio
        </button>

        <span className="certifications-eyebrow">
          LEARNING · GROWTH · ACHIEVEMENT
        </span>

        <h1>
          My <span>Certifications</span>
        </h1>

        <p>
          A showcase of my learning journey, achievements,
          and professional development.
        </p>
      </header>

      <div className="certificate-carousel">
        <button
          type="button"
          className="certificate-arrow certificate-arrow-left"
          onClick={showPrevious}
          aria-label="Previous certificate"
          title="Previous certificate"
        >
          ‹
        </button>

        <article
          key={certificate.title}
          className="certificate-card carousel-card"
          onPointerMove={handleCardMove}
          onPointerLeave={handleCardLeave}
        >
          <div className="certificate-visual">
            <img
              src={certificate.image}
              alt={`${certificate.title} certificate`}
            />

            <span className="certificate-number">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="certificate-details">
            <span className="certificate-label">
              CERTIFICATE OF ACHIEVEMENT
            </span>

            <h2>{certificate.title}</h2>

            <p className="certificate-issuer">
              {certificate.issuer}
            </p>

            {certificate.date && (
              <p className="certificate-date">
                {certificate.date}
              </p>
            )}
          </div>
        </article>

        <button
          type="button"
          className="certificate-arrow certificate-arrow-right"
          onClick={showNext}
          aria-label="Next certificate"
          title="Next certificate"
        >
          ›
        </button>
      </div>

      <div className="certificate-carousel-footer">
        <div className="certificate-dots">
          {certificates.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={`certificate-dot ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>

        <span className="certificate-counter">
          {String(activeIndex + 1).padStart(2, "0")}
          {" / "}
          {String(certificates.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
