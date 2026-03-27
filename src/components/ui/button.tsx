import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // =========================
  // 🎨 UI / APPEARANCE
  // =========================
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success" | "destructive";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;

  width?: number | string;
  height?: number | string;

  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";

  bgColor?: string;
  textColor?: string;
  borderColor?: string;

  borderWidth?: number;
  shadow?: boolean;
  shadowColor?: string;

  opacity?: number;

  // Gradient
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl";

  // Typography
  fontSize?: number;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";

  // Spacing
  padding?: number | string;
  margin?: number | string;

  // =========================
  // 🧩 CONTENT
  // =========================
  label?: string;
  children?: React.ReactNode;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;

  loading?: boolean;
  loadingText?: string;
  loadingPosition?: "left" | "right" | "center";

  disabled?: boolean;
  active?: boolean;
  selected?: boolean;

  // =========================
  // ⚡ ANIMATION
  // =========================
  animate?: boolean;

  transitionDuration?: number;
  transitionType?: "ease" | "linear" | "spring";

  // Hover
  hoverScale?: number;
  hoverOpacity?: number;
  hoverBgColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;

  // Press / Active
  activeScale?: number;
  pressAnimation?: "shrink" | "bounce" | "none";

  // Ripple
  rippleEffect?: boolean;
  rippleColor?: string;
  rippleDuration?: number;

  // Preset Animations
  animationType?: "bounce" | "pulse" | "shake" | "wiggle";
  loopAnimation?: boolean;
  animationDelay?: number;

  // Entrance Animations
  fadeIn?: boolean;
  slideIn?: boolean;
  slideDirection?: "left" | "right" | "top" | "bottom";

  // =========================
  // 🖱️ EVENTS / INTERACTIONS
  // =========================
  onClick?: (e?: any) => void;
  onDoubleClick?: (e?: any) => void;

  onMouseEnter?: (e?: any) => void;
  onMouseLeave?: (e?: any) => void;

  onMouseDown?: (e?: any) => void;
  onMouseUp?: (e?: any) => void;

  // Mobile / Touch
  onPress?: () => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;

  // Focus
  onFocus?: () => void;
  onBlur?: () => void;

  // =========================
  // ♿ ACCESSIBILITY
  // =========================
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;

  // =========================
  // 🔁 BEHAVIOR
  // =========================
  type?: "button" | "submit" | "reset";

  preventDefault?: boolean;
  stopPropagation?: boolean;

  debounceTime?: number;
  throttleTime?: number;

  confirmBeforeClick?: boolean;
  confirmBeforeClickModalTitle?: string;
  confirmBeforeClickModalContent?: React.ReactNode;
  confirmBeforeClickFooterAction?: React.ReactNode;

  // =========================
  // 🔗 NAVIGATION
  // =========================
  href?: string;
  target?: "_blank" | "_self";

  // =========================
  // 🧠 ADVANCED / COMPOSITION
  // =========================
  as?: "button" | "a" | "div";

  className?: string;
  style?: React.CSSProperties;

  testID?: string; // for testing
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    fullWidth,
    width,
    height,
    rounded = "md",
    bgColor,
    textColor,
    borderColor,
    borderWidth,
    shadow,
    shadowColor,
    opacity,
    gradientFrom,
    gradientTo,
    gradientDirection = "to-r",
    fontSize,
    fontWeight,
    padding,
    margin,
    label,
    children,
    leftIcon,
    rightIcon,
    iconOnly,
    loading,
    loadingText,
    loadingPosition = "left",
    disabled,
    active,
    selected,
    animate,
    transitionDuration,
    transitionType,
    hoverScale,
    hoverOpacity,
    hoverBgColor,
    hoverTextColor,
    hoverBorderColor,
    activeScale,
    pressAnimation,
    rippleEffect,
    rippleColor,
    rippleDuration,
    animationType,
    loopAnimation,
    animationDelay,
    fadeIn,
    slideIn,
    slideDirection,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    onFocus,
    onBlur,
    ariaLabel,
    role,
    tabIndex,
    type = "button",
    preventDefault,
    stopPropagation,
    debounceTime,
    throttleTime,
    confirmBeforeClick,
    confirmBeforeClickModalTitle,
    confirmBeforeClickModalContent,
    confirmBeforeClickFooterAction,
    href,
    target,
    as = "button",
    style,
    testID,
    ...props
  }, ref) => {
    // Determine the element type
    const Element = href ? 'a' : as === 'a' ? 'a' : as === 'div' ? 'div' : 'button';

    // Build className
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variantClasses = {
      primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
      secondary: "bg-secondary text-white hover:bg-secondary-hover",
      outline: "border border-slate-400/60 bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      danger: "bg-danger text-danger-foreground hover:bg-danger-hover",
      success: "bg-success text-success-foreground hover:bg-success-hover",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
    };

    const sizeClasses = {
      xs: iconOnly ? "h-7 w-7 p-0 text-xs" : "h-6 px-2 py-1 text-xs",
      sm: iconOnly ? "h-8 w-8 p-0 text-sm" : "h-8 px-3 py-1 text-sm",
      md: iconOnly ? "h-10 w-10 p-0"       : "h-10 px-4 py-2",
      lg: iconOnly ? "h-12 w-12 p-0 text-lg" : "h-12 px-6 py-3 text-lg",
      xl: iconOnly ? "h-14 w-14 p-0 text-xl" : "h-14 px-8 py-4 text-xl",
    };

    const roundedClasses = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    };

    const fontWeightClasses = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses[rounded],
      fontWeightClasses[fontWeight],
      fullWidth && "w-full",
      shadow && "shadow",
      active && "bg-accent",
      selected && "ring-2 ring-primary",
      className
    );

    // Resolve semantic color tokens to CSS var()
    const COLOR_TOKENS: Record<string, string> = {
      primary:   "var(--primary)",
      secondary: "var(--secondary)",
      danger:    "var(--danger)",
      warning:   "var(--warning)",
      success:   "var(--success)",
      info:      "var(--info)",
      muted:     "var(--muted)",
      accent:    "var(--accent)",
    }
    const resolveColor = (c?: string) => c ? (COLOR_TOKENS[c] ?? c) : undefined

    // Build inline styles
    const inlineStyles: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      backgroundColor: bgColor,
      color: textColor,
      borderColor,
      borderWidth: borderWidth ? `${borderWidth}px` : undefined,
      boxShadow: shadowColor ? `0 1px 3px 0 ${shadowColor}` : undefined,
      opacity,
      fontSize: fontSize ? `${fontSize}px` : undefined,
      padding: typeof padding === 'number' ? `${padding}px` : padding,
      margin: typeof margin === 'number' ? `${margin}px` : margin,
      transform: hoverScale ? `scale(${hoverScale})` : undefined,
      transitionDuration: transitionDuration ? `${transitionDuration}ms` : undefined,
      animationDelay: animationDelay ? `${animationDelay}ms` : undefined,
      background: gradientFrom && gradientTo ? `linear-gradient(${gradientDirection === "to-r" ? "to right" : gradientDirection === "to-l" ? "to left" : gradientDirection === "to-t" ? "to top" : gradientDirection === "to-b" ? "to bottom" : gradientDirection === "to-tr" ? "to top right" : gradientDirection === "to-tl" ? "to top left" : gradientDirection === "to-br" ? "to bottom right" : "to bottom left"}, ${resolveColor(gradientFrom)}, ${resolveColor(gradientTo)})` : undefined,
      ...style,
    };

    // Confirm modal state
    const [confirmOpen, setConfirmOpen] = React.useState(false)
    const pendingEvent = React.useRef<React.MouseEvent | null>(null)

    // Handle events
    const handleClick = (e: React.MouseEvent) => {
      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();
      if (confirmBeforeClick) {
        pendingEvent.current = e
        setConfirmOpen(true)
        return
      }
      onClick?.(e);
    };

    function handleConfirmProceed() {
      setConfirmOpen(false)
      onClick?.(pendingEvent.current ?? undefined)
      pendingEvent.current = null
    }

    function handleConfirmCancel() {
      setConfirmOpen(false)
      pendingEvent.current = null
    }

    // Content
    const buttonContent = (
      <>
        {loading && loadingPosition === "left" && <div className="animate-spin mr-2">⟳</div>}
        {leftIcon && <span className={iconOnly ? "" : "mr-2"}>{leftIcon}</span>}
        {!iconOnly && (loading ? loadingText || "Loading..." : label || children)}
        {iconOnly && !leftIcon && (loading ? loadingText || "Loading..." : label || children)}
        {rightIcon && <span className={iconOnly ? "" : "ml-2"}>{rightIcon}</span>}
        {loading && loadingPosition === "right" && <div className="animate-spin ml-2">⟳</div>}
      </>
    );

    const sharedProps = {
      ref: ref as any,
      className: classes,
      style: inlineStyles,
      onClick: handleClick,
      onDoubleClick,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
      "aria-label": ariaLabel,
      role,
      tabIndex,
      "data-testid": testID,
    }

    // Confirm modal overlay
    const confirmModal = confirmBeforeClick && confirmOpen ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleConfirmCancel}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-base font-semibold text-foreground mb-2">
            {confirmBeforeClickModalTitle ?? "Are you sure?"}
          </p>
          {confirmBeforeClickModalContent && (
            <div className="text-sm text-muted-foreground mb-5">
              {confirmBeforeClickModalContent}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            {confirmBeforeClickFooterAction ?? (
              <>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmProceed}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  Proceed
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    ) : null

    if (Element === 'a') {
      return (
        <>
          {confirmModal}
          <a {...(sharedProps as any)} href={href} target={target}>
            {buttonContent}
          </a>
        </>
      )
    }

    if (Element === 'div') {
      return (
        <>
          {confirmModal}
          <div {...(sharedProps as any)}>
            {buttonContent}
          </div>
        </>
      )
    }

    return (
      <>
        {confirmModal}
        <button
          {...(sharedProps as any)}
          type={type}
          disabled={disabled}
          {...props}
        >
          {buttonContent}
        </button>
      </>
    );
  }
)
Button.displayName = "Button"

export { Button }
