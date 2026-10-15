# Cosmic Violet — 3D Animated Developer Portfolio

An immersive, interactive developer portfolio built with React, Three.js, React Three Fiber, and GSAP. It features a cinematic 3D mountain and forest environment, an interactive 3D avatar, animated project cards, a certification carousel, and an integrated contact form.

## ✨ Key Features

- **Cinematic 3D Environment:** Interactive mountain, forest, moon, and atmospheric background.
- **Interactive 3D Avatar:** GLB model rendering, mouse-responsive rotation, and violet spotlight reveal effects.
- **GSAP Animations:** Smooth entrance animations, staggered transitions, and scroll-triggered effects using ScrollTrigger.
- **Project Showcase:** Animated project cards with 3D tilt effects, live demo links, and GitHub repositories.
- **Certifications Gallery:** Single-card carousel with navigation arrows, pagination dots, and certificate details.
- **Skills Section:** Organized overview of development, programming, 3D, and workflow skills.
- **Resume Download:** Direct PDF download functionality.
- **Contact Form:** Email integration using EmailJS with form validation and submission feedback.
- **Responsive UI:** Adaptive layouts, interactive hover states, glassmorphism, and reduced-motion support.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, JavaScript, HTML5 |
| Styling | CSS3, CSS Grid, Flexbox, Media Queries |
| 3D Graphics | Three.js, React Three Fiber |
| 3D Model Loading | GLTFLoader, GLB |
| Animation | GSAP, ScrollTrigger |
| Email Integration | EmailJS |
| Development Tools | VS Code, npm, Git, GitHub |
| Deployment | Netlify-compatible static deployment |

## 📁 Project Structure

```text
portfolio/
├── public/
│   ├── models/
│   │   └── Avatar.glb
│   └── resume.pdf
├── src/
│   ├── assets/
│   │   └── certificates/
│   │       ├── AIML.png
│   │       ├── Frontend.jpg
│   │       ├── NPTEL_CC.png
│   │       └── Java_FSD.jpg
│   ├── components/
│   │   ├── AboutAvatar.jsx
│   │   ├── CertificationPage.jsx
│   │   └── Scene.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
└── README.md
```

*Note: The structure above represents the expected project layout. Keep filenames and locations consistent with your actual project.*

## ⚙️ Installation and Setup

**1. Clone the repository**

```bash
git clone <https://github.com/PursuitOfc0de/Project.git>
cd portfolio
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root and add your EmailJS configuration:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Replace the placeholders with your actual EmailJS values.

**4. Start the development server**

```bash
npm run dev
```

**5. Create a production build**

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🎨 Methods and Techniques

- **Real-Time 3D Rendering:** Scene composition, lighting, camera control, and GLB model loading.
- **Interactive Motion:** Pointer tracking, interpolated avatar rotation, and cursor-following visual effects.
- **Scroll-Based Animation:** GSAP timelines, staggered element reveals, and ScrollTrigger.
- **3D Card Interactions:** Pointer-based rotation, perspective transforms, and dynamic lighting effects.
- **Component-Based Architecture:** Reusable React components, hooks, and state-driven UI.
- **Carousel Navigation:** React state management for previous/next navigation and direct slide selection.
- **Responsive Design:** CSS Grid, Flexbox, media queries, and touchscreen adaptations.
- **Email Integration:** Asynchronous form submission, loading states, success/error feedback, and input validation.

## 🔐 Environment Variables

- Keep `.env` out of version control by adding it to `.gitignore`.
- Configure the same required environment variable names in your deployment platform.
- EmailJS public configuration is used in the frontend; never expose private credentials or email passwords in client-side code.

## 🚀 Deployment

Build the project using `npm run build` and deploy the generated `dist/` directory to Netlify or another static hosting platform. Configure the EmailJS environment variables in the hosting dashboard and rebuild after adding them.

## 👨‍💻 Author

**Rishabh Kumar**  
B.Tech Computer Science and Engineering Student

- **LinkedIn:** [Rishabh Kumar](https://www.linkedin.com/in/rishabh-kumar-35169026a)
- **Project:** [ Live Demo](https://portfolio-ris.netlify.app/)

---

*Built to explore the intersection of 3D graphics, creative development, and interactive web experiences.*
