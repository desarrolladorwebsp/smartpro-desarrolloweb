"use client";

import { X } from "lucide-react";
import { useEffect, useId, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { buttonLinkClassName, type ButtonLinkVariant } from "@/components/ui/button-link";
import { CALENDLY_EMBED_URL, CALENDLY_URL } from "@/lib/calendly";

type CalendlyPopupButtonProps = {
  children: ReactNode;
  variant?: ButtonLinkVariant;
  className?: string;
  onOpen?: () => void;
};

export function CalendlyPopupButton({
  children,
  variant = "primary",
  className = "",
  onOpen,
}: CalendlyPopupButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onOpen?.();
    setOpen(true);
  };

  return (
    <>
      <a href={CALENDLY_URL} className={buttonLinkClassName(variant, className)} onClick={onClick}>
        {children}
      </a>
      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[50] flex items-center justify-center overflow-hidden bg-sp-ink/45 p-3 sm:p-5"
              role="presentation"
              onClick={() => setOpen(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative flex h-[calc(100dvh-1.5rem)] w-full max-w-[920px] overflow-hidden rounded-[1.5rem] bg-sp-white shadow-sp-card sm:h-[calc(100dvh-2.5rem)]"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 id={titleId} className="sr-only">
                  Agendar reunión gratuita
                </h2>
                <button
                  type="button"
                  aria-label="Cerrar calendario"
                  className="absolute right-3 top-3 z-[1] grid h-10 w-10 place-items-center rounded-full bg-sp-white text-sp-ink shadow-sp-soft transition hover:bg-sp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-violet"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
                <iframe
                  title="Calendario de SmartPro"
                  src={CALENDLY_EMBED_URL}
                  className="h-full w-full border-0"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
