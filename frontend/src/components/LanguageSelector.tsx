import React from "react";
import type { Language } from "../services/api";

interface Props {
    id: string;
    label: string;
    value: string;
    languages: Language[];
    onChange: (code: string) => void;
    includeAuto?: boolean;
}

const LanguageSelector: React.FC<Props> = ({
    id,
    label,
    value,
    languages,
    onChange,
    includeAuto = false,
}) => {
    // Build options with proper handling of loading state
    let options = [...languages];
    
    // Ensure auto detect is first if includeAuto is true
    if (includeAuto) {
        const hasAutoDetect = options.some((l) => l.code === "auto");
        if (!hasAutoDetect) {
            options = [{ code: "auto", name: "Auto Detect" }, ...options];
        } else if (options[0]?.code !== "auto") {
            // Move auto to the front if it's not already there
            options = [
                options.find((l) => l.code === "auto")!,
                ...options.filter((l) => l.code !== "auto"),
            ];
        }
    } else {
        // Remove auto from target language
        options = options.filter((l) => l.code !== "auto");
    }

    const isLoading = languages.length === 0;

    return (
        <div className="lang-group">
            <span className="lang-label">{label}</span>
            <select
                id={id}
                className="lang-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                aria-label={label}
            >
                {isLoading ? (
                    <option disabled value="">
                        Loading languages...
                    </option>
                ) : (
                    options.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};

export default LanguageSelector;
