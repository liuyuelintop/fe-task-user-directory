// systems/code/LayoutSystem.tsx
// Comprehensive layout system demonstrating responsive design patterns

import React from "react";

// Container components for consistent spacing and max-widths
interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function Container({
  children,
  size = "lg",
  className = "",
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className={`container mx-auto px-4 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Section component for consistent vertical spacing
interface SectionProps {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg" | "xl";
  background?: "white" | "gray" | "transparent";
  className?: string;
}

export function Section({
  children,
  spacing = "lg",
  background = "white",
  className = "",
}: SectionProps) {
  const spacingClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-24",
  };

  const backgroundClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    transparent: "bg-transparent",
  };

  return (
    <section
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
}

// Grid system for responsive layouts
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Grid({
  children,
  cols = 3,
  gap = "md",
  className = "",
}: GridProps) {
  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  };

  return (
    <div
      className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

// Flex container with common patterns
interface FlexProps {
  children: React.ReactNode;
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Flex({
  children,
  direction = "row",
  align = "start",
  justify = "start",
  wrap = false,
  gap = "md",
  className = "",
}: FlexProps) {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={`
      flex 
      ${directionClasses[direction]} 
      ${alignClasses[align]} 
      ${justifyClasses[justify]} 
      ${wrap ? "flex-wrap" : ""} 
      ${gapClasses[gap]} 
      ${className}
    `}
    >
      {children}
    </div>
  );
}

// Card component for content containers
interface CardProps {
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg" | "xl";
  shadow?: "sm" | "md" | "lg" | "xl" | "none";
  border?: boolean;
  className?: string;
}

export function Card({
  children,
  padding = "md",
  shadow = "sm",
  border = true,
  className = "",
}: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12",
  };

  const shadowClasses = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    none: "shadow-none",
  };

  return (
    <div
      className={`
      bg-white 
      rounded-lg 
      ${paddingClasses[padding]} 
      ${shadowClasses[shadow]} 
      ${border ? "border border-gray-200" : ""} 
      ${className}
    `}
    >
      {children}
    </div>
  );
}

// Layout components for common page structures
interface PageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  sidebar,
  header,
  footer,
  className = "",
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {header && <header className="flex-shrink-0">{header}</header>}

      <div className="flex flex-1">
        {sidebar && (
          <aside className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200">
            {sidebar}
          </aside>
        )}

        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  );
}

// Centered content layout
interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function CenteredLayout({
  children,
  maxWidth = "md",
  className = "",
}: CenteredLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
  };

  return (
    <div className={`mx-auto px-4 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}

// Usage examples
export function LayoutExamples() {
  return (
    <div className="space-y-12 p-8">
      {/* Container examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Container Sizes</h3>
        <div className="space-y-4">
          <Container size="sm" className="bg-blue-100 p-4">
            <p>Small container (max-w-2xl)</p>
          </Container>
          <Container size="md" className="bg-green-100 p-4">
            <p>Medium container (max-w-4xl)</p>
          </Container>
          <Container size="lg" className="bg-yellow-100 p-4">
            <p>Large container (max-w-6xl)</p>
          </Container>
        </div>
      </section>

      {/* Grid examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Grid System</h3>
        <Grid cols={4} gap="md">
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i} padding="md">
              <p>Grid Item {i + 1}</p>
            </Card>
          ))}
        </Grid>
      </section>

      {/* Flex examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Flex Layouts</h3>
        <div className="space-y-4">
          <Flex justify="between" align="center" className="bg-gray-100 p-4">
            <span>Left</span>
            <span>Right</span>
          </Flex>
          <Flex
            direction="col"
            align="center"
            gap="md"
            className="bg-gray-100 p-4"
          >
            <span>Top</span>
            <span>Middle</span>
            <span>Bottom</span>
          </Flex>
        </div>
      </section>

      {/* Card examples */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Card Variants</h3>
        <Grid cols={3} gap="md">
          <Card padding="sm" shadow="sm">
            <h4 className="font-semibold mb-2">Small Card</h4>
            <p className="text-gray-600">Small padding and shadow</p>
          </Card>
          <Card padding="md" shadow="md">
            <h4 className="font-semibold mb-2">Medium Card</h4>
            <p className="text-gray-600">Medium padding and shadow</p>
          </Card>
          <Card padding="lg" shadow="lg">
            <h4 className="font-semibold mb-2">Large Card</h4>
            <p className="text-gray-600">Large padding and shadow</p>
          </Card>
        </Grid>
      </section>
    </div>
  );
}
