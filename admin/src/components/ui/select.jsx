// components/ui/select.jsx
import React from "react";
import { cn } from "@/lib/utils";

export function Select({
  value,
  onValueChange,
  children,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      className={cn(
        "block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}

// These are just aliases for compatibility
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectTrigger = Select;
export const SelectValue = ({ placeholder }) => (
  <option value="" disabled>
    {placeholder}
  </option>
);
