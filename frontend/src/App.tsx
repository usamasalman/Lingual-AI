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
        <a href="https://learn.microsoft.com/en-us/azure/ai-services/translator/" target="_blank" rel="noreferrer">
          Microsoft Translator API
        </a>{" "}
        · Built for the AI Internship Program @ SoftGrowTech
      </p>
    </footer>
  </div>
);

export default App;
