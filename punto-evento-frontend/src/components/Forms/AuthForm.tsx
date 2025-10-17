import type { ReactNode } from "react";
import { Button } from "../Buttons/Button";

interface AuthFormProps {
  children: ReactNode;
  title: string;
  error?: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthForm({ children, title, error, onSubmit }: AuthFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {children}
    </form>
  );
}

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name: string;
}

export function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  name,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-gray-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface FormButtonProps {
  text: string;
  type?: "submit" | "button";
  onClick?: () => void;
}

export function FormButton({
  text,
  type = "submit",
  onClick,
}: FormButtonProps) {
  return (
    <Button type={type} handleOnClick={onClick} className="w-full">
      {text}
    </Button>
  );
}

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="bg-blue-100 rounded-t-xl px-8 pt-8 pb-2 text-center">
      <h1 className="text-3xl font-extrabold mb-1 font-cursive">{title}</h1>
      <p className="text-gray-600 text-base font-cursive">{subtitle}</p>
    </div>
  );
}

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="bg-white rounded-b-xl px-8 py-8 shadow-lg">{children}</div>
  );
}
