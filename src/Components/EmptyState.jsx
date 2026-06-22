import React from "react";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  iconName = "FolderOpen",
  title = "No Items Found",
  description = "There is nothing to display here yet.",
  actionText,
  actionLink,
  onActionClick,
}) {
  const IconComponent = LucideIcons[iconName] || LucideIcons.FolderOpen;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-slate-800/30 border border-slate-800 rounded-3xl animate-fade-in my-6">
      {/* Icon Wrapper */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 shadow-glow-primary border border-indigo-500/10">
        <IconComponent className="w-8 h-8" />
      </div>

      {/* Texts */}
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action CTA */}
      {actionText && (
        <>
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all duration-200"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all duration-200"
            >
              {actionText}
            </button>
          )}
        </>
      )}
    </div>
  );
}
