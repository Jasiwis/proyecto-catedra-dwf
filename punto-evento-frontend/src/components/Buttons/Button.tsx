import type { ReactNode } from "react";
import { AiOutlineLoading } from "react-icons/ai";

export const Button = ({
  children,
  type = "button",
  handleOnClick,
  className,
  disabled = false,
  isLoading = false,
}: {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  handleOnClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <button
      type={type}
      onClick={handleOnClick}
      className={`cursor-pointer bg-gradient-to-r from-cyan-400 to-blue-400 !text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading && <AiOutlineLoading />}
      {children}
    </button>
  );
};
