import React from 'react';

const ClearBGLogo = ({ size = 40, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${className} filter drop-shadow-lg`}
        >
            <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Outer Shape (Rounded Diamond) */}
            <rect
                x="15" y="15" width="70" height="70"
                rx="22"
                transform="rotate(45 50 50)"
                fill="url(#logo-grad)"
            />

            {/* The "Cut" line */}
            <path
                d="M20 50 L80 50"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="1 15"
                opacity="0.3"
                transform="rotate(-45 50 50)"
            />

            {/* The Magic Spark */}
            <circle
                cx="70" cy="30" r="8"
                fill="white"
                className="animate-pulse"
            />
            <path
                d="M65 30 L75 30 M70 25 L70 35"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* The Main Scissors Stylized */}
            <path
                d="M35 65 L65 35 M35 35 L65 65"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.9"
            />
        </svg>
    );
};

export default ClearBGLogo;
