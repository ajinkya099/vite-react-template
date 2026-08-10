import * as React from "react"
import { cn } from "../../lib/utils"

const Dialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean; onOpenChange?: (open: boolean) => void }
>(({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />)
Dialog.displayName = "Dialog"

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => <button ref={ref} className={cn("", className)} {...props} />)
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("fixed inset-0 z-50 flex items-center justify-center", className)} {...props}>
    <div className="fixed inset-0 bg-black/80" />
    <div className="relative z-50 max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
      {children}
    </div>
  </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription }
