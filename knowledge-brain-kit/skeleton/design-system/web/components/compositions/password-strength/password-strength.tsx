"use client";

import * as React from "react";

interface PasswordStrengthResult {
    /** Strength score from 0-100 */
    score: number;
    /** Categorical strength level */
    strength: "very_weak" | "weak" | "fair" | "good" | "strong";
    /** Individual security requirement checks */
    checks: {
        minLength: boolean;
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasNumber: boolean;
        hasSpecial?: boolean;
    };
}

interface PasswordStrengthIndicatorProps {
    /** Password string to evaluate */
    password: string;
    /** Minimum required length (default: 8) */
    minLength?: number;
    /** Whether special characters are required (default: false) */
    requireSpecial?: boolean;
    /** Optional className for styling */
    className?: string;
}

/**
 * PasswordStrengthIndicator - Displays real-time password strength feedback
 * with visual indicators and requirement checklist.
 */
const PasswordStrengthIndicator = React.forwardRef<
    HTMLDivElement,
    PasswordStrengthIndicatorProps
>(({ password, minLength = 8, requireSpecial = false, className }, ref) => {
    const calculateStrength = (): PasswordStrengthResult => {
        const checks = {
            minLength: password.length >= minLength,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: requireSpecial
                ? /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
                : undefined,
        };

        const relevantChecks = Object.entries(checks).filter(
            ([, value]) => value !== undefined,
        );
        const passedChecks = relevantChecks.filter(([, value]) => value).length;
        const totalChecks = relevantChecks.length;
        const score = Math.round((passedChecks / totalChecks) * 100);

        let strength: PasswordStrengthResult["strength"] = "very_weak";
        if (score >= 100) strength = "strong";
        else if (score >= 75) strength = "good";
        else if (score >= 50) strength = "fair";
        else if (score >= 25) strength = "weak";

        return { score, strength, checks };
    };

    const result = calculateStrength();

    const getColor = () => {
        switch (result.strength) {
            case "strong":
                return "bg-success";
            case "good":
                return "bg-info";
            case "fair":
                return "bg-warning";
            case "weak":
                return "bg-warning";
            default:
                return "bg-destructive";
        }
    };

    const getTextColor = () => {
        switch (result.strength) {
            case "strong":
                return "text-success";
            case "good":
                return "text-info";
            case "fair":
                return "text-warning";
            case "weak":
                return "text-warning";
            default:
                return "text-destructive";
        }
    };

    const getStrengthLabel = () => {
        switch (result.strength) {
            case "very_weak":
                return "Very weak";
            case "weak":
                return "Weak";
            case "fair":
                return "Fair";
            case "good":
                return "Good";
            case "strong":
                return "Strong";
        }
    };

    if (!password) return null;

    return (
        <div
            ref={ref}
            className={className || "space-y-2 mt-2"}
            data-testid="password-strength-indicator"
            data-slot="password-strength"
        >
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
                    style={{ width: `${result.score}%` }}
                    data-testid="strength-bar"
                />
            </div>

            {/* Strength label */}
            <p className={`text-sm font-medium ${getTextColor()}`}>
                Strength: {getStrengthLabel()}
            </p>

            {/* Requirements checklist */}
            <ul className="text-xs space-y-1">
                <li className={result.checks.minLength ? "text-success" : "text-muted-foreground"}>
                    {result.checks.minLength ? "\u2713" : "\u25CB"} Minimum {minLength} characters
                </li>
                <li className={result.checks.hasUppercase ? "text-success" : "text-muted-foreground"}>
                    {result.checks.hasUppercase ? "\u2713" : "\u25CB"} At least one uppercase letter
                </li>
                <li className={result.checks.hasLowercase ? "text-success" : "text-muted-foreground"}>
                    {result.checks.hasLowercase ? "\u2713" : "\u25CB"} At least one lowercase letter
                </li>
                <li className={result.checks.hasNumber ? "text-success" : "text-muted-foreground"}>
                    {result.checks.hasNumber ? "\u2713" : "\u25CB"} At least one number
                </li>
                {requireSpecial && (
                    <li className={result.checks.hasSpecial ? "text-success" : "text-muted-foreground"}>
                        {result.checks.hasSpecial ? "\u2713" : "\u25CB"} At least one special character
                    </li>
                )}
            </ul>
        </div>
    );
});
PasswordStrengthIndicator.displayName = "PasswordStrengthIndicator";

export { PasswordStrengthIndicator };
export type { PasswordStrengthIndicatorProps, PasswordStrengthResult };
