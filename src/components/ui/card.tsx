import * as React from "react"
import { cn } from "@/src/lib/utils"
import { Animate, type AnimationType } from "./container"

// ─── Base Sub-components ──────────────────────────────────────────────────────

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { animationType?: AnimationType; animationDelay?: number }>(
  ({ className, animationType, animationDelay = 0, ...props }, ref) => {
    if (animationType) {
      return (
        <Animate animationType={animationType} delay={animationDelay}>
          <div ref={ref} className={cn("rounded-xl glass text-card-foreground shadow-lg", className)} {...props} />
        </Animate>
      )
    }
    return <div ref={ref} className={cn("rounded-xl glass text-card-foreground shadow-lg", className)} {...props} />
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

// ─── Variant 1: Flat ──────────────────────────────────────────────────────────
export function CardFlat({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card text-card-foreground border border-border", className)} {...props} />
}

// ─── Variant 2: Elevated ──────────────────────────────────────────────────────
export function CardElevated({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card text-card-foreground shadow-2xl", className)} {...props} />
}

// ─── Variant 3: Outlined ─────────────────────────────────────────────────────
export function CardOutlined({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-transparent border-2 border-border text-card-foreground", className)} {...props} />
}

// ─── Variant 4: Ghost ────────────────────────────────────────────────────────
export function CardGhost({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-transparent text-card-foreground hover:bg-accent/30 transition-colors", className)} {...props} />
}

// ─── Variant 5: Glass ────────────────────────────────────────────────────────
export function CardGlass({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-background/40 backdrop-blur-xl border border-white/10 text-card-foreground shadow-lg", className)} {...props} />
}

// ─── Variant 6: Gradient Primary ─────────────────────────────────────────────
export function CardGradientPrimary({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-gradient-to-br from-primary to-info text-white shadow-lg", className)} {...props} />
}

// ─── Variant 7: Gradient Dark ────────────────────────────────────────────────
export function CardGradientDark({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 text-white shadow-lg", className)} {...props} />
}

// ─── Variant 8: Gradient Sunset ──────────────────────────────────────────────
export function CardGradientSunset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-lg", className)} {...props} />
}

// ─── Variant 9: Gradient Ocean ───────────────────────────────────────────────
export function CardGradientOcean({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-lg", className)} {...props} />
}

// ─── Variant 10: Gradient Forest ─────────────────────────────────────────────
export function CardGradientForest({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg", className)} {...props} />
}

// ─── Variant 11: Glow Primary ────────────────────────────────────────────────
export function CardGlowPrimary({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-primary/30 text-card-foreground shadow-[0_0_24px_-4px_var(--primary)]", className)} {...props} />
}

// ─── Variant 12: Glow Success ────────────────────────────────────────────────
export function CardGlowSuccess({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-success/30 text-card-foreground shadow-[0_0_24px_-4px_var(--success)]", className)} {...props} />
}

// ─── Variant 13: Glow Danger ─────────────────────────────────────────────────
export function CardGlowDanger({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-danger/30 text-card-foreground shadow-[0_0_24px_-4px_var(--danger)]", className)} {...props} />
}

// ─── Variant 14: Glow Warning ────────────────────────────────────────────────
export function CardGlowWarning({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-warning/30 text-card-foreground shadow-[0_0_24px_-4px_var(--warning)]", className)} {...props} />
}

// ─── Variant 15: Glow Info ───────────────────────────────────────────────────
export function CardGlowInfo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-info/30 text-card-foreground shadow-[0_0_24px_-4px_var(--info)]", className)} {...props} />
}

// ─── Variant 16: Tinted Primary ──────────────────────────────────────────────
export function CardTintedPrimary({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-primary/10 border border-primary/20 text-card-foreground", className)} {...props} />
}

// ─── Variant 17: Tinted Success ──────────────────────────────────────────────
export function CardTintedSuccess({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-success/10 border border-success/20 text-card-foreground", className)} {...props} />
}

// ─── Variant 18: Tinted Danger ───────────────────────────────────────────────
export function CardTintedDanger({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-danger/10 border border-danger/20 text-card-foreground", className)} {...props} />
}

// ─── Variant 19: Tinted Warning ──────────────────────────────────────────────
export function CardTintedWarning({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-warning/10 border border-warning/20 text-card-foreground", className)} {...props} />
}

// ─── Variant 20: Tinted Info ─────────────────────────────────────────────────
export function CardTintedInfo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-info/10 border border-info/20 text-card-foreground", className)} {...props} />
}

// ─── Variant 21: Bordered Top Primary ────────────────────────────────────────
export function CardBorderTopPrimary({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border border-t-4 border-t-primary text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 22: Bordered Top Success ────────────────────────────────────────
export function CardBorderTopSuccess({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border border-t-4 border-t-success text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 23: Bordered Top Danger ─────────────────────────────────────────
export function CardBorderTopDanger({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border border-t-4 border-t-danger text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 24: Bordered Top Warning ────────────────────────────────────────
export function CardBorderTopWarning({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border border-t-4 border-t-warning text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 25: Bordered Left Primary ───────────────────────────────────────
export function CardBorderLeftPrimary({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border border-l-4 border-l-primary text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 26: Bordered Left Success ───────────────────────────────────────
export function CardBorderLeftSuccess({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border border-l-4 border-l-success text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 27: Bordered Left Danger ────────────────────────────────────────
export function CardBorderLeftDanger({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border border-l-4 border-l-danger text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 28: Bordered Left Warning ───────────────────────────────────────
export function CardBorderLeftWarning({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border border-l-4 border-l-warning text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 29: Interactive (hover lift) ────────────────────────────────────
export function CardInteractive({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border text-card-foreground shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40", className)} {...props} />
}

// ─── Variant 30: Interactive Glow ────────────────────────────────────────────
export function CardInteractiveGlow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border border-border text-card-foreground shadow-sm cursor-pointer transition-all duration-300 hover:shadow-[0_0_32px_-4px_var(--primary)] hover:border-primary/50", className)} {...props} />
}

// ─── Variant 31: Compact ─────────────────────────────────────────────────────
export function CardCompact({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg bg-card border border-border text-card-foreground shadow-sm p-3", className)} {...props} />
}

// ─── Variant 32: Wide ────────────────────────────────────────────────────────
export function CardWide({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl bg-card border border-border text-card-foreground shadow-md w-full", className)} {...props} />
}

// ─── Variant 33: Rounded Full ────────────────────────────────────────────────
export function CardRounded({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-3xl bg-card border border-border text-card-foreground shadow-md", className)} {...props} />
}

// ─── Variant 34: Sharp ───────────────────────────────────────────────────────
export function CardSharp({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-none bg-card border border-border text-card-foreground shadow-sm", className)} {...props} />
}

// ─── Variant 35: Dashed ──────────────────────────────────────────────────────
export function CardDashed({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-card border-2 border-dashed border-border text-card-foreground", className)} {...props} />
}

// ─── Variant 36: Dashed Primary ──────────────────────────────────────────────
export function CardDashedPrimary({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-primary/5 border-2 border-dashed border-primary/40 text-card-foreground", className)} {...props} />
}

// ─── Variant 37: Noise Texture ───────────────────────────────────────────────
export function CardNoise({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl bg-card border border-border text-card-foreground shadow-md overflow-hidden relative", className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")" }}
      {...props}
    />
  )
}

// ─── Variant 38: Mesh Gradient ───────────────────────────────────────────────
export function CardMesh({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl text-white shadow-xl overflow-hidden", className)}
      style={{ background: "radial-gradient(at 40% 20%, hsla(228,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)" }}
      {...props}
    />
  )
}

// ─── Variant 39: Dark Solid ───────────────────────────────────────────────────
export function CardDark({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-neutral-900 border border-neutral-800 text-white shadow-lg", className)} {...props} />
}

// ─── Variant 40: Light Solid ─────────────────────────────────────────────────
export function CardLight({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-white border border-neutral-200 text-neutral-900 shadow-sm", className)} {...props} />
}

// ─── Variant 41: Frosted Dark ────────────────────────────────────────────────
export function CardFrostedDark({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-black/50 backdrop-blur-2xl border border-white/5 text-white shadow-2xl", className)} {...props} />
}

// ─── Variant 42: Frosted Light ───────────────────────────────────────────────
export function CardFrostedLight({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-white/70 backdrop-blur-2xl border border-white/60 text-neutral-900 shadow-lg", className)} {...props} />
}

// ─── Variant 43: Stripe Accent ───────────────────────────────────────────────
export function CardStripeAccent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl bg-card border border-border text-card-foreground shadow-sm overflow-hidden", className)} {...props}>
      <div className="h-1 w-full bg-gradient-to-r from-primary via-info to-success" />
      {children}
    </div>
  )
}

// ─── Variant 44: Stripe Bottom ───────────────────────────────────────────────
export function CardStripeBottom({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl bg-card border border-border text-card-foreground shadow-sm overflow-hidden flex flex-col", className)} {...props}>
      <div className="flex-1">{children}</div>
      <div className="h-1 w-full bg-gradient-to-r from-primary via-info to-success" />
    </div>
  )
}

// ─── Variant 45: Image Header ────────────────────────────────────────────────
interface CardImageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc?: string
  imageAlt?: string
  imageHeight?: string
}
export function CardImageHeader({ className, children, imageSrc, imageAlt = "", imageHeight = "h-40", ...props }: CardImageHeaderProps) {
  return (
    <div className={cn("rounded-xl bg-card border border-border text-card-foreground shadow-sm overflow-hidden", className)} {...props}>
      <div className={cn("w-full bg-gradient-to-br from-primary/30 to-info/30", imageHeight)}>
        {imageSrc && <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />}
      </div>
      {children}
    </div>
  )
}

// ─── Variant 46: Avatar Card ─────────────────────────────────────────────────
interface CardAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: string
  name?: string
  role?: string
}
export function CardAvatar({ className, avatar, name, role, children, ...props }: CardAvatarProps) {
  return (
    <div className={cn("rounded-xl bg-card border border-border text-card-foreground shadow-sm p-6 flex items-start gap-4", className)} {...props}>
      <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-white font-bold text-lg overflow-hidden">
        {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : (name?.[0] ?? "?")}
      </div>
      <div className="flex-1 min-w-0">
        {name && <p className="font-semibold text-sm truncate">{name}</p>}
        {role && <p className="text-xs text-muted-foreground">{role}</p>}
        {children}
      </div>
    </div>
  )
}

// ─── Variant 47: Stat Mini ───────────────────────────────────────────────────
interface CardStatMiniProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  value?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
}
export function CardStatMini({ className, label, value, trend, trendValue, icon, ...props }: CardStatMiniProps) {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-muted-foreground"
  const trendSymbol = trend === "up" ? "↑" : trend === "down" ? "↓" : "→"
  return (
    <div className={cn("rounded-xl bg-card border border-border text-card-foreground shadow-sm p-5 flex items-center justify-between gap-4", className)} {...props}>
      <div>
        {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
        {value !== undefined && <p className="text-2xl font-bold">{value}</p>}
        {trendValue && <p className={cn("text-xs mt-1 font-medium", trendColor)}>{trendSymbol} {trendValue}</p>}
      </div>
      {icon && <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>}
    </div>
  )
}

// ─── Variant 48: Pricing Card ────────────────────────────────────────────────
interface CardPricingProps extends React.HTMLAttributes<HTMLDivElement> {
  plan?: string
  price?: string
  period?: string
  features?: string[]
  highlighted?: boolean
  action?: React.ReactNode
}
export function CardPricing({ className, plan, price, period = "/mo", features = [], highlighted, action, ...props }: CardPricingProps) {
  return (
    <div className={cn(
      "rounded-2xl border text-card-foreground shadow-sm p-6 flex flex-col gap-5",
      highlighted ? "bg-primary border-primary text-white shadow-[0_0_32px_-4px_var(--primary)]" : "bg-card border-border",
      className
    )} {...props}>
      {plan && <p className={cn("text-sm font-semibold uppercase tracking-widest", highlighted ? "text-white/70" : "text-muted-foreground")}>{plan}</p>}
      {price && (
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className={cn("text-sm mb-1", highlighted ? "text-white/60" : "text-muted-foreground")}>{period}</span>
        </div>
      )}
      {features.length > 0 && (
        <ul className="space-y-2">
          {features.map((f, i) => (
            <li key={i} className={cn("flex items-center gap-2 text-sm", highlighted ? "text-white/90" : "text-card-foreground")}>
              <span className={cn("text-xs", highlighted ? "text-white" : "text-success")}>✓</span> {f}
            </li>
          ))}
        </ul>
      )}
      {action && <div className="mt-auto">{action}</div>}
    </div>
  )
}

// ─── Variant 49: Notification Card ───────────────────────────────────────────
type NotifVariant = "info" | "success" | "warning" | "danger"
interface CardNotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NotifVariant
  title?: string
  message?: string
  icon?: React.ReactNode
  onDismiss?: () => void
}
const notifStyles: Record<NotifVariant, string> = {
  info:    "bg-info/10 border-info/30 text-info",
  success: "bg-success/10 border-success/30 text-success",
  warning: "bg-warning/10 border-warning/30 text-warning",
  danger:  "bg-danger/10 border-danger/30 text-danger",
}
export function CardNotification({ className, variant = "info", title, message, icon, onDismiss, ...props }: CardNotificationProps) {
  return (
    <div className={cn("rounded-xl border p-4 flex items-start gap-3", notifStyles[variant], className)} {...props}>
      {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {message && <p className="text-sm opacity-80 mt-0.5">{message}</p>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-sm leading-none">✕</button>
      )}
    </div>
  )
}

// ─── Variant 50: Skeleton Card ───────────────────────────────────────────────
export function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl bg-card border border-border shadow-sm p-6 space-y-4 animate-pulse", className)} {...props}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted rounded w-3/4" />
          <div className="h-2 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded" />
        <div className="h-2 bg-muted rounded w-5/6" />
        <div className="h-2 bg-muted rounded w-4/6" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-8 bg-muted rounded-lg flex-1" />
        <div className="h-8 bg-muted rounded-lg flex-1" />
      </div>
    </div>
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
