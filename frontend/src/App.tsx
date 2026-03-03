import React from "react";
import Header from "./components/Header";
import TranslatorCard from "./components/TranslatorCard";

const App: React.FC = () => (
  <div className="app">
    <Header />
    <TranslatorCard />
    <footer className="footer">
      <p>
        Powered by{" "}
        <a href="https://mymemory.translated.net/" target="_blank" rel="noreferrer">
          MyMemory API
        </a>{" "}
        · Built for the AI Internship Program @ SoftGrowTech
      </p>
    </footer>
  </div>
);

export default App;
