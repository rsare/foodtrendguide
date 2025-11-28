import React from "react";

interface ButtonProps {
    label: string;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => (
    <button
        onClick={onClick}
        className={`bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-xl transition ${className}`}
    >
        {label}
    </button>
);

export default Button;
