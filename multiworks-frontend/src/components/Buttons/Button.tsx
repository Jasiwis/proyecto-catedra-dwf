import type { ReactNode } from "react";

export const Button = ({
  children,
  type = "button",
  handleOnClick,
  className,
}: {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  handleOnClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      type={type}
      onClick={handleOnClick}
      className={`cursor-pointer bg-gradient-to-r from-cyan-400 to-blue-400 !text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition ${className}`}
    >
      {children}
    </button>
  );
};
