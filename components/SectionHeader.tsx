import { ReactNode } from "react";

interface SectionHeaderProps {
  children: ReactNode;
  className?: string;
}

export default function SectionHeader({ children, className = "" }: SectionHeaderProps) {
  return (
    <div className={`relative mb-4 ${className}`}>
      <div className="section-header">
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border-light" />
    </div>
  );
}
