
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import profilePhoto from "./assets/ProfileMe.png";
import AboutAvatar from "./components/AboutAvatar";
import Scene from "./components/Scene";
import CertificationsPage from "./components/CertificationPage";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const contentRef = useRef(null);

  // Certifications page visibility
  const [showCertifications, setShowCertifications] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactStatus, setContactStatus] = useState({
    type: "",
    text: "",
  });

  const [isSending, setIsSending] = useState(false);

  // Project card mouse movement and 3D tilt
  const handleCardMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty(
      "--mouse-x",
      `${(x / rect.width) * 100}%`
    );

    card.style.setProperty(
      "--mouse-y",
      `${(y / rect.height) * 100}%`
    );

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  // Reset project card when the mouse leaves
  const handleCardLeave = (event) => {
    gsap.to(event.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  // Update contact form fields
  const handleContactChange = (event) => {
    const { name, value } = event.target;

    setContactForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Send the contact form using EmailJS
  const handleContactSubmit = async (event) => {
    event.preventDefault();

    if (isSending) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Check whether EmailJS is configured
    if (!serviceId || !templateId || !publicKey) {
      setContactStatus({
        type: "error",
        text: "EmailJS setup incomplete. Please check your .env file.",
      });
      return;
    }

    setIsSending(true);
    setContactStatus({ type: "", text: "" });

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: contactForm.name,
          from_email: contactForm.email,
          subject: contactForm.subject,
          message: contactForm.message,
        },
        { publicKey }
      );

      // Show success message and reset the form
      setContactStatus({
        type: "success",
        text: "Message sent successfully! Thank you for reaching out.",
      });

      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);

      setContactStatus({
        type: "error",
        text: "Message could not be sent. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  // GSAP animations for website sections
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.from(".hero-content > *", {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      // About section scroll animation
      gsap.from(".about-content", {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about",
          start: "top 75%",
        },
      });

      // Project cards entrance animation
      gsap.from(".project-card", {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects",
          start: "top 75%",
        },
      });

      // Skills cards entrance animation
      gsap.from(".skill-card", {
        opacity: 0,
        y: 55,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".skills",
          start: "top 75%",
          once: true,
        },
      });

      // Contact section entrance animation
      gsap.from(".contact-content", {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact",
          start: "top 75%",
        },
      });
    }, contentRef);

    // Clean up GSAP animations when the component unmounts
    return () => ctx.revert();
  }, []);

  return (
    <main className="website">
      {/* 3D Mountains and Forest Background */}
      <div className="background-3d">
        <Scene />
      </div>

      {/* Main Website Content */}
      <div className="content" ref={contentRef}>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="logo">RK.</div>

          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="small-text">CREATIVE DEVELOPER</p>

            <h1>
              Rishabh
              <br />
              Kumar
            </h1>

            <p className="description">
              I build modern digital experiences with code, motion and 3D.
            </p>

            {/* Scroll to Projects */}
            <button
              className="explore-btn"
              onClick={() =>
                document.getElementById("projects")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore
            </button>

            {/* Download Resume PDF */}
            <a
              className="resume-btn"
              href="/My resume.pdf"
              download="Rishabh-Kumar-Resume.pdf"
            >
              <span>↓</span> Download Resume
            </a>
          </div>
          <div className="hero-photo-wrap">
                  <img
                    src={profilePhoto}
                    alt="Rishabh Kumar"
                    className="hero-photo"
                  />
                <div className="hero-photo-glow" />
          </div>
        </section>

        {/* About Section and Interactive 3D Avatar */}
        <section className="about" id="about">
          <div className="about-layout">
            <div className="about-content">
              <p>ABOUT ME</p>

              <h2>
                B.Tech CSE Student
                <br />
                &amp; Creative Developer
              </h2>

              <p className="about-description">
                I am Rishabh Kumar, currently pursuing B.Tech in Computer
                Science and Engineering. I enjoy building modern web
                experiences with interactive 3D visuals and animation.
              </p>

              <a
                className="project-link project-link-secondary"
                href="https://www.linkedin.com/in/rishabh-kumar-35169026a"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn ↗
              </a>
            </div>

            {/* Clicking the avatar opens Certifications */}
            <AboutAvatar
              onClick={() => setShowCertifications(true)}
            />
          </div>
        </section>

        {/* Projects Section */}
        <section className="projects" id="projects">
          <p>MY WORK</p>
          <h2>Selected Projects</h2>

          <div className="project-grid">
            {/* Featured Project: Code Bridge */}
            <div
              className="project-card"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
            >
              <div className="project-card-inner">
                <span>01 / FEATURED PROJECT</span>
                <h3>Code Bridge</h3>

                <p>
                  An educational web project designed to make learning more
                  accessible through a modern web experience.
                </p>

                <div className="project-actions">
                  <a
                    className="project-link"
                    href="https://code-bridgeeducation.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo ↗
                  </a>

                  <a
                    className="project-link project-link-secondary"
                    href="https://github.com/PursuitOfc0de/My-Projects/tree/master/Code-Bridge"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Upcoming Project 2 */}
            <div
              className="project-card"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
            >
              <div className="project-card-inner">
                <span>02</span>
                <h3>Coming Soon</h3>
                <p>More projects are on the way.</p>
              </div>
            </div>

            {/* Upcoming Project 3 */}
            <div
              className="project-card"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
            >
              <div className="project-card-inner">
                <span>03</span>
                <h3>Coming Soon</h3>
                <p>More projects are on the way.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills" id="skills">
          <p className="section-label">WHAT I WORK WITH</p>

          <h2>
            My <span>Skills.</span>
          </h2>

          <p className="skills-description">
            Technologies and tools I use to build modern, interactive web
            experiences.
          </p>

          <div className="skills-grid">
            {/* Frontend Development */}
            <div className="skill-card">
              <span className="skill-number">01</span>
              <h3>Frontend Development</h3>

              <div className="skill-tags">
                <span>HTML5</span>
                <span>CSS3</span>
                <span>Bootstrap</span>
                <span>Angular</span>
                <span>JavaScript</span>
                <span>React</span>
                <span>Responsive Design</span>
              </div>
            </div>

            {/* 3D and Animation */}
            <div className="skill-card">
              <span className="skill-number">02</span>
              <h3>3D &amp; Animation</h3>

              <div className="skill-tags">
                <span>Three.js</span>
                <span>React Three Fiber</span>
                <span>GSAP</span>
                <span>3D Web Experiences</span>
              </div>
            </div>

            {/* Programming Languages */}
            <div className="skill-card">
              <span className="skill-number">03</span>
              <h3>Programming</h3>

              <div className="skill-tags">
                <span>C</span>
                <span>Java</span>
                <span>Python</span>
                <span>Data Structures</span>
              </div>
            </div>

            {/* Tools and Workflow */}
            <div className="skill-card">
              <span className="skill-number">04</span>
              <h3>Tools &amp; Workflow</h3>

              <div className="skill-tags">
                <span>Git</span>
                <span>GitHub</span>
                <span>VS Code</span>
                <span>Netlify</span>
                <span>Figma</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section and EmailJS Form */}
        <section className="contact" id="contact">
          <div className="contact-content">
            <p>HAVE A PROJECT?</p>

            <h2>Let's create something amazing.</h2>

            <p className="contact-description">
              Have an opportunity or a project idea? Send me a message.
            </p>

            <form
              className="contact-form"
              onSubmit={handleContactSubmit}
            >
              <div className="contact-form-row">
                <label>
                  Your Name
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    maxLength={100}
                    autoComplete="name"
                  />
                </label>

                <label>
                  Your Email
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    maxLength={254}
                    autoComplete="email"
                  />
                </label>
              </div>

              <label>
                Subject
                <input
                  type="text"
                  name="subject"
                  placeholder="What is this about?"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  required
                  maxLength={150}
                />
              </label>

              <label>
                Your Message
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  maxLength={5000}
                  rows={5}
                />
              </label>

              {/* Submit button and feedback message */}
              <button
                className="explore-btn contact-submit"
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message ↗"}
              </button>

              {contactStatus.text && (
                <p
                  className={`contact-status ${contactStatus.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {contactStatus.text}
                </p>
              )}
            </form>
          </div>
        </section>
      </div>

      {/* Certifications Page Overlay */}
      {showCertifications && (
        <CertificationsPage
          onBack={() => setShowCertifications(false)}
        />
      )}
    </main>
  );
}

export default App;
