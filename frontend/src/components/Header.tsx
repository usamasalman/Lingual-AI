import React from "react";

const Header: React.FC = () => (
    <header className="header">
        <div className="header-logo">
            <div className="header-logo-icon" aria-hidden="true">🌐</div>
            <h1>LinguaAI</h1>
        </div>
        <p className="header-sub">
            AI-powered instant translation across 30+ languages
        </p>
    </header>
);

export default Header;
