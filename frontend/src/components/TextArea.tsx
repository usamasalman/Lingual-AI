import React, { forwardRef } from "react";

export interface TextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Threshold for warning class (default 4500) */
    warnThreshold?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            value = "",
            maxLength = 5000,
            className = "",
            warnThreshold = 4500,
            ...props
        },
        ref
    ) => {
        const strVal = typeof value === "string" ? value : "";
        const charCount = strVal.length;
        const charWarn = charCount > warnThreshold;

        return (
            <>
                <textarea
                    ref={ref}
                    value={value}
                    maxLength={maxLength}
                    className={`panel-textarea ${className}`}
                    {...props}
                />
                {/* show counter only when editable */}
                {!props.readOnly && (
                    <div className={`char-count ${charWarn ? "warn" : ""}`}>
                        {charCount} / {maxLength}
                    </div>
                )}
            </>
        );
    }
);

export default TextArea;
