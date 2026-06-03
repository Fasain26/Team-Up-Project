import { forwardRef, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * A labelled input that shows a validation error underneath.
 * forwardRef lets react-hook-form's register() attach to the real <input>.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink/80">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          {...props}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-ink outline-none transition
            placeholder:text-ink/30 focus:ring-2 focus:ring-brand-500/40
            ${error ? "border-red-400" : "border-black/10 focus:border-brand-500"}`}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

TextField.displayName = "TextField";
