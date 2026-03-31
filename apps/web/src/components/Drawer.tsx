import { useEffect, useState } from "react";
import ReactDOM, { flushSync } from "react-dom";
import { X } from "lucide-react";

type DrawerWidth = "md" | "lg" | "xl";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: DrawerWidth;
};

const widthClasses: Record<DrawerWidth, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const ANIMATION_DURATION_MS = 1000;

export function Drawer({ isOpen, onClose, title, children, footer, width = "lg" }: DrawerProps) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      flushSync(() => setIsMounted(true));
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsMounted(false), ANIMATION_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 motion-reduce:transition-none ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`rounded-l-xl fixed inset-y-0 right-0 w-full ${widthClasses[width]} bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="border-t border-gray-200 px-6 py-4 bg-white">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
