import React from "react";

interface FloatingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconBgClass?: string;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  icon,
  title,
  description,
  className = "",
  iconBgClass = "bg-emerald-100 text-emerald-600"
}) => {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-xl w-48 ${className}`}>
      <div className={`w-10 h-10 rounded-lg ${iconBgClass} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-gray-500 text-xs mt-1">{description}</p>
    </div>
  );
};

export default FloatingCard;
