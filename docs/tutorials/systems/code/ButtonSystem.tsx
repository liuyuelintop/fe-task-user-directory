// systems/code/ButtonSystem.tsx
// Comprehensive button system demonstrating Tailwind design patterns

import React from "react";

// Base button component with all variants and states
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  // Base classes that apply to all buttons
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant-specific styling
  const variantClasses = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
    outline:
      "bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-50 focus:ring-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  // Size-specific styling
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
}

// Button group component for related actions
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className = "" }: ButtonGroupProps) {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// Button group item with proper spacing and borders
interface ButtonGroupItemProps extends ButtonProps {
  isFirst?: boolean;
  isLast?: boolean;
}

export function ButtonGroupItem({
  isFirst = false,
  isLast = false,
  className = "",
  ...props
}: ButtonGroupItemProps) {
  const positionClasses = `
    ${isFirst ? "rounded-l-lg" : "-ml-px"}
    ${isLast ? "rounded-r-lg" : ""}
    ${!isFirst && !isLast ? "rounded-none" : ""}
  `;

  return <Button {...props} className={`${positionClasses} ${className}`} />;
}

// Icon button for compact actions
interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  "aria-label": string;
}

export function IconButton({
  icon,
  "aria-label": ariaLabel,
  ...props
}: IconButtonProps) {
  return (
    <Button {...props} aria-label={ariaLabel} className="p-2">
      {icon}
    </Button>
  );
}

// Floating action button for mobile-first designs
interface FloatingActionButtonProps extends Omit<ButtonProps, "size"> {
  icon: React.ReactNode;
}

export function FloatingActionButton({
  icon,
  ...props
}: FloatingActionButtonProps) {
  return (
    <Button
      {...props}
      size="lg"
      className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl z-50"
    >
      {icon}
    </Button>
  );
}

// Usage examples component
export function ButtonExamples() {
  return (
    <div className="space-y-8 p-8">
      {/* Basic variants */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      {/* Different sizes */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </section>

      {/* States */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Button States</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Button group */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Button Group</h3>
        <ButtonGroup>
          <ButtonGroupItem isFirst>First</ButtonGroupItem>
          <ButtonGroupItem>Middle</ButtonGroupItem>
          <ButtonGroupItem isLast>Last</ButtonGroupItem>
        </ButtonGroup>
      </section>

      {/* Icon buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Icon Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton
            icon={<span>+</span>}
            aria-label="Add item"
            variant="primary"
          />
          <IconButton
            icon={<span>✏️</span>}
            aria-label="Edit item"
            variant="outline"
          />
          <IconButton
            icon={<span>🗑️</span>}
            aria-label="Delete item"
            variant="danger"
          />
        </div>
      </section>
    </div>
  );
}
