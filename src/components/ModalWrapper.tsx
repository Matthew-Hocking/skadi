import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

type ModalWrapperProps = {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function ModalWrapper({
  onClose,
  children,
  className = "w-[50%]",
}: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

        const focusables = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute("disabled")
        );

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (focusables.length === 0) return;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    return () => {
      previouslyFocusedElement.current?.focus();
    };
  }, []);

  const backdropVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.1,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center md:items-center md:justify-center z-50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          ref={modalRef}
          className={`
            bg-white shadow-lg
            p-4 sm:p-6
            max-h-[100dvh]
            overflow-y-auto
            md:rounded-lg
            w-full h-full max-w-none
            md:h-auto md:w-[90%] md:max-w-2xl
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}