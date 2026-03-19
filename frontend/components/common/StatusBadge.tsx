import { Badge } from "@/components/ui/badge"; // Importing YOUR specific Badge
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // 1. Normalize status string
  const normalizedStatus = status;

  // 2. Logic to determine Base Variant + Custom Styles
  const getStyle = (s: string) => {
    switch (s) {
      case "Active":
      case "Valid":
      case "Healthy":
        // Using 'default' (Solid Primary Green)
        return { 
          variant: "default" as const, 
          icon: <CheckCircle2 className="w-3 h-3 mr-1.5" />,
          customClass: "bg-primary hover:bg-primary/90" 
        };
      
      case "Expiring Soon":
      case "Warning":
      case "Degraded":
        // 'Warning' doesn't exist in your Badge, so we use 'secondary' base + semantic override
        return { 
          variant: "secondary" as const, 
          icon: <Clock className="w-3 h-3 mr-1.5" />,
          // Applying the Warning semantic token colors manually
          customClass: "bg-warning/15 text-warning-foreground border-warning/20 hover:bg-warning/25 text-amber-700 bg-amber-100" 
        };

      case "Inactive":
      case "Expired":
      case "Suspended":
      case "Critical":
        // Using 'destructive' (Solid Red)
        return { 
          variant: "destructive" as const, 
          icon: <XCircle className="w-3 h-3 mr-1.5" />,
          customClass: "" 
        };

      default:
        // Fallback to neutral
        return { 
          variant: "secondary" as const, 
          icon: <MinusCircle className="w-3 h-3 mr-1.5" />,
          customClass: "bg-muted text-muted-foreground" 
        };
    }
  };

  const { variant, icon, customClass } = getStyle(normalizedStatus);

  return (
    <Badge 
      variant={variant} 
      className={cn("font-medium", customClass, className)}
    >
      {icon}
      {status}
    </Badge>
  );
}