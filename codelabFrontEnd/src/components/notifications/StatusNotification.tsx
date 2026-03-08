import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

type StatusNotificationVariant = "success" | "error";

interface StatusNotificationProps {
  variant: StatusNotificationVariant;
  message: string;
  title?: string;
  isVisible: boolean;
  onClose?: () => void;
  autoHideMs?: number;
}

const variantStyles: Record<
  StatusNotificationVariant,
  {
    wrapper: string;
    iconClassName: string;
    icon: typeof faCircleCheck;
    defaultTitle: string;
  }
> = {
  success: {
    wrapper: "border-[#58b368] bg-[#e9f8ed] text-[#1f6b2f]",
    iconClassName: "text-[#2a9d42]",
    icon: faCircleCheck,
    defaultTitle: "Operacion completada",
  },
  error: {
    wrapper: "border-[#e05a5a] bg-[#fdeeee] text-[#8f1e1e]",
    iconClassName: "text-[#cc3b3b]",
    icon: faTriangleExclamation,
    defaultTitle: "Ocurrio un error",
  },
};

export default function StatusNotification({
  variant,
  message,
  title,
  isVisible,
  onClose,
  autoHideMs = 3200,
}: Readonly<StatusNotificationProps>) {
  useEffect(() => {
    if (!isVisible || !onClose) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      onClose();
    }, autoHideMs);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [autoHideMs, isVisible, onClose]);

  if (!isVisible || !message.trim()) {
    return null;
  }

  const currentStyles = variantStyles[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-5 right-5 z-50 flex w-[min(92vw,420px)] items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-200 ${currentStyles.wrapper}`}
    >
      <FontAwesomeIcon
        icon={currentStyles.icon}
        className={`pt-0.5 text-lg ${currentStyles.iconClassName}`}
      />

      <div className="min-w-0 flex-1">
        <p className="text-base font-bold leading-5">
          {title ?? currentStyles.defaultTitle}
        </p>
        <p className="mt-1 text-sm font-medium leading-5">{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificacion"
          className="cursor-pointer rounded-md p-1 text-current/80 transition-colors hover:bg-black/10 hover:text-current"
        >
          <FontAwesomeIcon icon={faXmark} className="text-sm" />
        </button>
      )}
    </div>
  );
}
