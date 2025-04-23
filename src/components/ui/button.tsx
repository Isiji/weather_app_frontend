import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
    >
      {children}
    </button>
  );
}
