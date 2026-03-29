import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-[#1A2E44] text-white hover:opacity-90",
          variant === "outline" && "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
          variant === "ghost" && "hover:bg-gray-100 text-gray-700",
          variant === "destructive" && "bg-red-500 text-white hover:bg-red-600",
          size === "default" && "h-9 px-4 py-2 text-sm rounded-xl",
          size === "sm" && "h-8 px-3 text-xs rounded-lg",
          size === "lg" && "h-11 px-6 text-base rounded-xl",
          size === "icon" && "h-9 w-9 rounded-xl",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
