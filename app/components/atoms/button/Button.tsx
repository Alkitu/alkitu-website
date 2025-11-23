'use client';

import { ButtonProps } from './button.type';

const variantStyles: Record<string, string> = {
  primary: 'bg-primary text-zinc-950 border border-primary hover:shadow-primary/50 hover:shadow-md',
  secondary: 'bg-transparent border border-foreground text-foreground hover:text-background hover:bg-foreground',
  outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-zinc-950',
  ghost: 'bg-transparent border-none text-foreground hover:bg-foreground/10',
  link: 'bg-transparent border-none text-foreground hover:text-primary underline-offset-4 hover:underline',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-4',
  md: 'h-10 px-4',
  lg: 'h-12 px-4',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  fullWidth = false,
  iconBefore,
  iconAfter,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold uppercase rounded-md transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

  const widthStyles = fullWidth ? 'w-full' : '';

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {iconBefore && <span className="flex items-center">{iconBefore}</span>}
      {children}
      {iconAfter && <span className="flex items-center">{iconAfter}</span>}
    </button>
  );
}
