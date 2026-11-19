import { useCallback, useRef, useState } from "react";
import { Background, Footer, Nav, Toast } from "./components/Chrome.jsx";
import Hero from "./components/Hero.jsx";
import { Contact, Education, Experience, Marquee, Profile, Reach, Skills } from "./components/Sections.jsx";

export default function App() {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const notify = useCallback(t => {
    setToast(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <>
      <Background />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Profile />
        <Experience />
        <Skills />
        <Reach />
        <Education />
        <Contact notify={notify} />
      </main>
      <Footer />
      <Toast toast={toast} />
    </>
  );
}
