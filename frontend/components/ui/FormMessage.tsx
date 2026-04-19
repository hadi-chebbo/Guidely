import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageType = "error" | "success" | "info";

interface FormMessageProps {
  type:      MessageType;
  message:   string;
  className?: string;
}

const styles: Record<MessageType, { wrapper: string; icon: React.ReactNode }> = {
  error: {
    wrapper: "bg-red-50 border border-red-200 text-red-700",
    icon:    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  },
  success: {
    wrapper: "bg-brand-50 border border-brand-200 text-brand-700",
    icon:    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />,
  },
  info: {
    wrapper: "bg-blue-50 border border-blue-200 text-blue-700",
    icon:    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
  },
};

export default function FormMessage({ type, message, className }: FormMessageProps) {
  const { wrapper, icon } = styles[type];

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm",
        wrapper,
        className
      )}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}
