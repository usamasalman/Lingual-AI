import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    getLanguages,
    translateText,
    type Language,
} from "../services/api";
import LanguageSelector from "./LanguageSelector";
import ToastContainer, { type Toast } from "./ToastContainer";
import TextArea from "./TextArea";

let toastIdCounter = 0;

const TranslatorCard: React.FC = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [sourceText, setSourceText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("es");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Load languages
    useEffect(() => {
        getLanguages()
            .then((langs) => setLanguages(langs))
            .catch(() => showToast("Failed to load languages list.", "error"));
    }, []);

    const showToast = useCallback(
        (message: string, type: Toast["type"] = "info") => {
            const id = ++toastIdCounter;
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(
                () => setToasts((prev) => prev.filter((t) => t.id !== id)),
                3500
            );
        },
        []
    );

    // Translate
    const handleTranslate = async () => {
        if (!sourceText.trim()) {
            showToast("Please enter text to translate.", "error");
            inputRef.current?.focus();
            return;
        }
        if (sourceLang === targetLang && sourceLang !== "auto") {
            showToast("Source and target languages must be different.", "error");
            return;
        }

        setLoading(true);
        setOutputText("");

        try {
            const res = await translateText({
                text: sourceText,
                source: sourceLang,
                target: targetLang,
            });

            if (res.error) {
                showToast(res.error, "error");
            } else {
                setOutputText(res.translatedText ?? "");
            }
        } catch {
            showToast("Could not reach the translation server. Is the backend running?", "error");
        } finally {
            setLoading(false);
        }
    };

    // Copy
    const handleCopy = async () => {
        if (!outputText) return;
        try {
            await navigator.clipboard.writeText(outputText);
            setCopied(true);
            showToast("Copied to clipboard!", "success");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showToast("Could not copy — check browser permissions.", "error");
        }
    };

    // Text-to-Speech
    const handleSpeak = () => {
        if (!outputText) return;
        if (!("speechSynthesis" in window)) {
            showToast("Text-to-speech is not supported in this browser.", "error");
            return;
        }
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }
        
        // Get the target language object to find the speech code
        const targetLangObj = languages.find((l) => l.code === targetLang);
        const speechLang = targetLangObj?.speechCode || targetLang || "en-US";
        
        const utterance = new SpeechSynthesisUtterance(outputText);
        utterance.lang = speechLang;
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => {
            setSpeaking(false);
            showToast("Speech synthesis error.", "error");
        };
        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    // Clear
    const handleClear = () => {
        setSourceText("");
        setOutputText("");
        window.speechSynthesis?.cancel();
        setSpeaking(false);
        inputRef.current?.focus();
    };

    // Swap languages
    const handleSwap = () => {
        if (sourceLang === "auto") return;
        const prevSource = sourceLang;
        const prevTarget = targetLang;
        const prevOutput = outputText;
        setSourceLang(prevTarget);
        setTargetLang(prevSource);
        setSourceText(prevOutput);
        setOutputText("");
    };

    // Keyboard shortcut: Ctrl+Enter to translate
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleTranslate();
        }
    };

    return (
        <>
            <div className="translator-card" role="main">
                {/* Language bar */}
                <div className="lang-bar" aria-label="Language selection">
                    <LanguageSelector
                        id="source-lang"
                        label="From"
                        value={sourceLang}
                        languages={languages}
                        onChange={setSourceLang}
                        includeAuto
                    />
                    <button
                        className="swap-btn"
                        onClick={handleSwap}
                        title="Swap languages"
                        aria-label="Swap source and target languages"
                        disabled={sourceLang === "auto"}
                    >
                        ⇄
                    </button>
                    <LanguageSelector
                        id="target-lang"
                        label="To"
                        value={targetLang}
                        languages={languages}
                        onChange={setTargetLang}
                    />
                </div>

                {/* Text panels */}
                <div className="panels">
                    {/* Source */}
                    <div className="panel">
                        <TextArea
                            ref={inputRef}
                            id="source-text"
                            placeholder="Enter text to translate… (Ctrl+Enter to translate)"
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={5000}
                            aria-label="Source text input"
                            spellCheck
                        />
                    </div>

                    {/* Output */}
                    <div className="panel">
                        <TextArea
                            id="output-text"
                            className={`output-area ${!outputText && !loading ? "empty" : ""} ${
                                loading ? "loading-state" : ""
                            }`}
                            placeholder={loading ? "Translating…" : "Translation appears here"}
                            value={loading ? "Translating…" : outputText}
                            readOnly
                            aria-label="Translated text output"
                            aria-live="polite"
                        />
                    </div>
                </div>

                {/* Action bar */}
                <div className="action-bar">
                    <div className="action-left">
                        <button
                            id="translate-btn"
                            className="btn-translate"
                            onClick={handleTranslate}
                            disabled={loading}
                            aria-label="Translate text"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" aria-hidden="true" />
                                    Translating…
                                </>
                            ) : (
                                <>✨ Translate</>
                            )}
                        </button>
                        <button
                            id="clear-btn"
                            className="btn-icon btn-clear"
                            onClick={handleClear}
                            disabled={!sourceText && !outputText}
                            aria-label="Clear all text"
                        >
                            ✕ Clear
                        </button>
                    </div>
                    <div className="action-right">
                        <button
                            id="speak-btn"
                            className="btn-icon btn-speak"
                            onClick={handleSpeak}
                            disabled={!outputText && !speaking}
                            aria-label={speaking ? "Stop speaking" : "Speak translation"}
                            title="Text-to-Speech"
                        >
                            {speaking ? "⏹ Stop" : "🔊 Speak"}
                        </button>
                        <button
                            id="copy-btn"
                            className={`btn-icon btn-copy ${copied ? "copied" : ""}`}
                            onClick={handleCopy}
                            disabled={!outputText}
                            aria-label="Copy translation to clipboard"
                        >
                            {copied ? "✓ Copied" : "⎘ Copy"}
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer toasts={toasts} />
        </>
    );
};

export default TranslatorCard;
