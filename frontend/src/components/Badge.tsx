import React from "react";

interface BadgeProps {
    text: string;
    color?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, color = "bg-green-600" }) => (
    <span className={`text-sm text-white px-2 py-1 rounded-lg ${color}`}>
    {text}
  </span>
);

export default Badge;
