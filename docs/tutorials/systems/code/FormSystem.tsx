// systems/code/FormSystem.tsx
// Comprehensive form system demonstrating input design patterns

import React, { useState } from "react";

// Base input component with validation states
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "error" | "success";
  size?: "sm" | "md" | "lg";
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  error,
  helperText,
  variant = "default",
  size = "md",
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  className = "",
  value,
  onChange,
  ...props
}: InputProps) {
  const baseClasses =
    "w-full border rounded-lg focus:outline-none focus:ring-2 transition-colors";

  const variantClasses = {
    default: "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
    error: "border-red-300 focus:ring-red-500 focus:border-red-500",
    success: "border-green-300 focus:ring-green-500 focus:border-green-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const inputClasses = `${baseClasses} ${
    variantClasses[error ? "error" : variant]
  } ${sizeClasses[size]} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Textarea component
interface TextareaProps {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
  label,
  error,
  helperText,
  rows = 4,
  placeholder,
  disabled = false,
  required = false,
  className = "",
  value,
  onChange,
  ...props
}: TextareaProps) {
  const baseClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  const errorClasses = error
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`${baseClasses} ${errorClasses} ${className}`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Select component
interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export function Select({
  label,
  error,
  helperText,
  placeholder,
  disabled = false,
  required = false,
  className = "",
  value,
  onChange,
  options,
  ...props
}: SelectProps) {
  const baseClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  const errorClasses = error
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`${baseClasses} ${errorClasses} ${className}`}
        disabled={disabled}
        required={required}
        value={value}
        onChange={onChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Checkbox component
interface CheckboxProps {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  className = "",
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-start space-x-3">
        <input
          type="checkbox"
          className={`mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
          disabled={disabled}
          required={required}
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
          {helperText && (
            <p className="text-sm text-gray-500 mt-1">{helperText}</p>
          )}
        </div>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Radio group component
interface RadioGroupProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function RadioGroup({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  className = "",
}: RadioGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-3">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={option.disabled}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Form group for organizing related fields
interface FormGroupProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function FormGroup({
  children,
  title,
  description,
  className = "",
}: FormGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// Complete form example
export function FormExample() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    message: "",
    newsletter: false,
    experience: "",
    errors: {} as Record<string, string>,
  });

  const handleInputChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        errors: { ...prev.errors, [field]: "" },
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormGroup
          title="Personal Information"
          description="Tell us about yourself"
        >
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange("name")}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange("email")}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleInputChange("phone")}
          />
        </FormGroup>

        <FormGroup title="Additional Information">
          <Select
            label="Country"
            placeholder="Select your country"
            options={countries}
            value={formData.country}
            onChange={handleInputChange("country")}
          />

          <RadioGroup
            label="Experience Level"
            options={experienceLevels}
            value={formData.experience}
            onChange={handleInputChange("experience")}
          />

          <Textarea
            label="Message"
            placeholder="Tell us about your goals"
            rows={4}
            value={formData.message}
            onChange={handleInputChange("message")}
          />

          <Checkbox
            label="Subscribe to newsletter"
            helperText="Get updates about new features and tips"
            checked={formData.newsletter}
            onChange={handleInputChange("newsletter")}
          />
        </FormGroup>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
