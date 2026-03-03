import React from "react";

interface Toast {
    id: number;
    message: string;
    type: "error" | "success" | "info";
}

interface Props {
    toasts: Toast[];
}

const ToastContainer: React.FC<Props> = ({ toasts }) => (
    <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type}`} role="alert">
                {t.type === "error" && "⚠ "}
                {t.type === "success" && "✓ "}
                {t.type === "info" && "ℹ "}
                {t.message}
            </div>
        ))}
    </div>
);

export default ToastContainer;
export type { Toast };
