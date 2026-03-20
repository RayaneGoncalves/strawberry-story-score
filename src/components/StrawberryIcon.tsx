import React from "react";

interface StrawberryIconProps {
  filled?: boolean;
  size?: number;
  className?: string;
}

const StrawberryIcon: React.FC<StrawberryIconProps> = ({ filled = false, size = 32, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaf */}
      <path
        d="M32 8C28 4 22 6 20 10C24 8 28 10 32 14C36 10 40 8 44 10C42 6 36 4 32 8Z"
        fill={filled ? "hsl(var(--strawberry-leaf))" : "hsl(var(--muted))"}
        className="transition-colors duration-300"
      />
      {/* Stem */}
      <rect x="30" y="2" width="4" height="10" rx="2" fill={filled ? "hsl(var(--strawberry-leaf))" : "hsl(var(--muted))"} className="transition-colors duration-300" />
      {/* Body */}
      <path
        d="M16 20C16 20 12 32 14 42C16 52 24 58 32 58C40 58 48 52 50 42C52 32 48 20 48 20C44 16 36 14 32 14C28 14 20 16 16 20Z"
        fill={filled ? "hsl(var(--strawberry))" : "hsl(var(--strawberry-light))"}
        className="transition-colors duration-300"
      />
      {/* Seeds */}
      {filled && (
        <>
          <circle cx="26" cy="30" r="1.5" fill="hsl(var(--primary-foreground))" opacity="0.6" />
          <circle cx="38" cy="30" r="1.5" fill="hsl(var(--primary-foreground))" opacity="0.6" />
          <circle cx="32" cy="36" r="1.5" fill="hsl(var(--primary-foreground))" opacity="0.6" />
          <circle cx="24" cy="40" r="1.5" fill="hsl(var(--primary-foreground))" opacity="0.6" />
          <circle cx="40" cy="40" r="1.5" fill="hsl(var(--primary-foreground))" opacity="0.6" />
          <circle cx="32" cy="48" r="1.5" fill="hsl(var(--primary-foreground))" opacity="0.6" />
          <circle cx="28" cy="52" r="1.5" fill="hsl(var(--primary-foreground))" opacity="0.6" />
          <circle cx="36" cy="52" r="1.5" fill="hsl(var(--primary-foreground))" opacity="0.6" />
        </>
      )}
    </svg>
  );
};

export default StrawberryIcon;
