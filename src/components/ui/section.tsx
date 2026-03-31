import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Animate, type AnimationType } from "./container"

export type SectionVariant = "default" | "card" | "bordered" | "ghost" | "neumorphic" | "gradient" | "glass" | "outline" | "elevated" | "minimal" | "modern" | "sleek" | "professional" | "soft" | "sharp" | "vintage" | "futuristic" | "organic" | "geometric" | "layered" | "metallic" | "matte" | "glossy" | "retro" | "cyber" | "ethereal" | "bold" | "subtle" | "dynamic" | "static" | "warm" | "cool" | "vibrant" | "muted" | "monochrome" | "colorful" | "textured" | "smooth" | "angular" | "rounded" | "compact" | "spacious" | "intricate" | "simple" | "elegant" | "rustic" | "industrial" | "artistic" | "technical" | "casual" | "formal" | "playful" | "serious" | "innovative" | "traditional"

export interface SectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  variant?: SectionVariant
  collapsible?: boolean
  defaultOpen?: boolean
  divider?: boolean
  animationType?: AnimationType
  animationDelay?: number
  className?: string
  contentClassName?: string
}

const variantWrap: Record<SectionVariant, string> = {
  default:      "",
  card:         "rounded-xl glass shadow-lg",
  bordered:     "rounded-xl border border-border",
  ghost:        "rounded-xl bg-muted/20",
  neumorphic:   "rounded-2xl bg-background shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_8px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.08)] border border-white/20",
  gradient:     "rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20",
  glass:        "rounded-xl bg-background/60 backdrop-blur-md border border-white/20 shadow-xl",
  outline:      "rounded-xl border-2 border-primary/30 bg-transparent",
  elevated:     "rounded-xl bg-background shadow-2xl border border-border/50",
  minimal:      "bg-transparent",
  modern:       "rounded-lg bg-gradient-to-br from-background to-muted/30 border border-border/60 shadow-sm",
  sleek:        "rounded-none bg-background border-b border-border",
  professional: "rounded-lg bg-card shadow-md border border-border/80",
  soft:         "rounded-2xl bg-muted/10 border border-muted/20 shadow-inner",
  sharp:        "rounded-none bg-background border border-border",
  vintage:      "rounded-md bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800",
  futuristic:   "rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 shadow-lg",
  organic:      "rounded-3xl bg-background border border-border",
  geometric:    "rounded-none bg-background border-4 border-primary/10",
  layered:      "rounded-xl bg-background shadow-lg border border-border relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:to-black/5 before:pointer-events-none",
  metallic:     "rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 shadow-md",
  matte:        "rounded-xl bg-background border border-border shadow-sm",
  glossy:       "rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-black border border-white/50 dark:border-gray-700 shadow-lg",
  retro:        "rounded-md bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-800",
  cyber:        "rounded-xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-800 shadow-glow",
  ethereal:     "rounded-2xl bg-background/80 backdrop-blur-sm border border-white/30 shadow-2xl",
  bold:         "rounded-lg bg-primary text-primary-foreground shadow-lg",
  subtle:       "rounded-xl bg-muted/5 border border-muted/20",
  dynamic:      "rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-border/50",
  static:       "rounded-xl bg-background border border-border",
  warm:         "rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800",
  cool:         "rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800",
  vibrant:      "rounded-xl bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 dark:from-red-900/20 dark:via-yellow-900/20 dark:to-green-900/20 border border-red-200 dark:border-red-800",
  muted:        "rounded-xl bg-muted/10 border border-muted/30",
  monochrome:   "rounded-xl bg-background border border-border",
  colorful:     "rounded-xl bg-gradient-to-r from-red-100 via-blue-100 to-green-100 dark:from-red-900/20 dark:via-blue-900/20 dark:to-green-900/20 border border-red-200 dark:border-red-800",
  textured:     "rounded-xl bg-background border border-border",
  smooth:       "rounded-xl bg-background border border-border",
  angular:      "rounded-none bg-background border border-border",
  rounded:      "rounded-3xl bg-background border border-border",
  compact:      "rounded-lg bg-background border border-border p-2",
  spacious:     "rounded-xl bg-background border border-border p-6",
  intricate:    "rounded-xl bg-background border border-border",
  simple:       "bg-background",
  elegant:      "rounded-xl bg-gradient-to-r from-background to-muted/10 border border-border/70 shadow-sm",
  rustic:       "rounded-lg bg-gradient-to-r from-amber-50 to-brown-50 dark:from-amber-900/20 dark:to-brown-900/20 border border-amber-200 dark:border-amber-800",
  industrial:   "rounded-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
  artistic:     "rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800",
  technical:    "rounded-md bg-background border-2 border-dashed border-border",
  casual:       "rounded-2xl bg-muted/10 border border-muted/20",
  formal:       "rounded-lg bg-card shadow-md border border-border",
  playful:      "rounded-3xl bg-gradient-to-r from-yellow-50 to-pink-50 dark:from-yellow-900/20 dark:to-pink-900/20 border border-yellow-200 dark:border-yellow-800",
  serious:      "rounded-none bg-background border border-border",
  innovative:   "rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800",
  traditional:  "rounded-md bg-background border border-border shadow-sm",
}

const variantHeader: Record<SectionVariant, string> = {
  default:      "pb-3",
  card:         "px-6 pt-6 pb-4",
  bordered:     "px-5 pt-5 pb-4",
  ghost:        "px-5 pt-5 pb-4",
  neumorphic:   "px-6 pt-6 pb-4",
  gradient:     "px-6 pt-6 pb-4",
  glass:        "px-6 pt-6 pb-4",
  outline:      "px-6 pt-6 pb-4",
  elevated:     "px-6 pt-6 pb-4",
  minimal:      "pb-3",
  modern:       "px-6 pt-6 pb-4",
  sleek:        "px-6 pt-6 pb-4",
  professional: "px-6 pt-6 pb-4",
  soft:         "px-6 pt-6 pb-4",
  sharp:        "px-6 pt-6 pb-4",
  vintage:      "px-6 pt-6 pb-4",
  futuristic:   "px-6 pt-6 pb-4",
  organic:      "px-6 pt-6 pb-4",
  geometric:    "px-6 pt-6 pb-4",
  layered:      "px-6 pt-6 pb-4",
  metallic:     "px-6 pt-6 pb-4",
  matte:        "px-6 pt-6 pb-4",
  glossy:       "px-6 pt-6 pb-4",
  retro:        "px-6 pt-6 pb-4",
  cyber:        "px-6 pt-6 pb-4",
  ethereal:     "px-6 pt-6 pb-4",
  bold:         "px-6 pt-6 pb-4",
  subtle:       "px-6 pt-6 pb-4",
  dynamic:      "px-6 pt-6 pb-4",
  static:       "px-6 pt-6 pb-4",
  warm:         "px-6 pt-6 pb-4",
  cool:         "px-6 pt-6 pb-4",
  vibrant:      "px-6 pt-6 pb-4",
  muted:        "px-6 pt-6 pb-4",
  monochrome:   "px-6 pt-6 pb-4",
  colorful:     "px-6 pt-6 pb-4",
  textured:     "px-6 pt-6 pb-4",
  smooth:       "px-6 pt-6 pb-4",
  angular:      "px-6 pt-6 pb-4",
  rounded:      "px-6 pt-6 pb-4",
  compact:      "px-4 pt-4 pb-3",
  spacious:     "px-8 pt-8 pb-6",
  intricate:    "px-6 pt-6 pb-4",
  simple:       "pb-3",
  elegant:      "px-6 pt-6 pb-4",
  rustic:       "px-6 pt-6 pb-4",
  industrial:   "px-6 pt-6 pb-4",
  artistic:     "px-6 pt-6 pb-4",
  technical:    "px-6 pt-6 pb-4",
  casual:       "px-6 pt-6 pb-4",
  formal:       "px-6 pt-6 pb-4",
  playful:      "px-6 pt-6 pb-4",
  serious:      "px-6 pt-6 pb-4",
  innovative:   "px-6 pt-6 pb-4",
  traditional:  "px-6 pt-6 pb-4",
}

const variantBody: Record<SectionVariant, string> = {
  default:      "",
  card:         "px-6 pb-6",
  bordered:     "px-5 pb-5",
  ghost:        "px-5 pb-5",
  neumorphic:   "px-6 pb-6",
  gradient:     "px-6 pb-6",
  glass:        "px-6 pb-6",
  outline:      "px-6 pb-6",
  elevated:     "px-6 pb-6",
  minimal:      "",
  modern:       "px-6 pb-6",
  sleek:        "px-6 pb-6",
  professional: "px-6 pb-6",
  soft:         "px-6 pb-6",
  sharp:        "px-6 pb-6",
  vintage:      "px-6 pb-6",
  futuristic:   "px-6 pb-6",
  organic:      "px-6 pb-6",
  geometric:    "px-6 pb-6",
  layered:      "px-6 pb-6",
  metallic:     "px-6 pb-6",
  matte:        "px-6 pb-6",
  glossy:       "px-6 pb-6",
  retro:        "px-6 pb-6",
  cyber:        "px-6 pb-6",
  ethereal:     "px-6 pb-6",
  bold:         "px-6 pb-6",
  subtle:       "px-6 pb-6",
  dynamic:      "px-6 pb-6",
  static:       "px-6 pb-6",
  warm:         "px-6 pb-6",
  cool:         "px-6 pb-6",
  vibrant:      "px-6 pb-6",
  muted:        "px-6 pb-6",
  monochrome:   "px-6 pb-6",
  colorful:     "px-6 pb-6",
  textured:     "px-6 pb-6",
  smooth:       "px-6 pb-6",
  angular:      "px-6 pb-6",
  rounded:      "px-6 pb-6",
  compact:      "px-4 pb-4",
  spacious:     "px-8 pb-8",
  intricate:    "px-6 pb-6",
  simple:       "",
  elegant:      "px-6 pb-6",
  rustic:       "px-6 pb-6",
  industrial:   "px-6 pb-6",
  artistic:     "px-6 pb-6",
  technical:    "px-6 pb-6",
  casual:       "px-6 pb-6",
  formal:       "px-6 pb-6",
  playful:      "px-6 pb-6",
  serious:       "px-6 pb-6",
  innovative:   "px-6 pb-6",
  traditional:  "px-6 pb-6",
}

export function SectionBlock({
  title,
  description,
  icon,
  action,
  children,
  variant = "default",
  collapsible = false,
  defaultOpen = true,
  divider = false,
  animationType,
  animationDelay = 0,
  className,
  contentClassName,
}: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  if (animationType) {
    return (
      <Animate animationType={animationType} delay={animationDelay} className={cn(variantWrap[variant], className)}>
        <SectionBlock
          title={title} description={description} icon={icon} action={action}
          variant={variant} collapsible={collapsible} defaultOpen={defaultOpen}
          divider={divider} contentClassName={contentClassName}
          className=""
        >
          {children}
        </SectionBlock>
      </Animate>
    )
  }

  return (
    <div className={cn(variantWrap[variant], className)}>
      {(title || description || action) && (
        <div
          className={cn(
            "flex items-start justify-between gap-3",
            variantHeader[variant],
            collapsible && "cursor-pointer select-none",
            divider && "border-b border-border pb-4"
          )}
          onClick={collapsible ? () => setOpen((o) => !o) : undefined}
        >
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <span className="mt-0.5 shrink-0 text-primary">{icon}</span>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-base font-semibold leading-tight">{title}</h3>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
            {collapsible && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            )}
          </div>
        </div>
      )}

      {(!collapsible || open) && (
        <div className={cn(variantBody[variant], contentClassName)}>
          {children}
        </div>
      )}
    </div>
  )
}
