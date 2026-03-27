import * as React from "react";
import { cn } from "@/src/lib/utils";
import { DatePickerPopup } from "./date-picker";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix" | "inputMode"
> {
  inputType?:
    | "email"
    | "numeric"
    | "integer"
    | "password"
    | "tel"
    | "url"
    | "color"
    | "date"
    | "dateTime"
    | "time";
  inputMode?:
    | "decimal"
    | "text"
    | "numeric"
    | "tel"
    | "url"
    | "email"
    | "search"
    | "none";
  datalist?: string[];
  autocapitalize?: "none" | "sentences" | "words" | "characters" | boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  required?: boolean;
  error?: string;
  regexValidation?: { pattern: RegExp; message?: string };
  prefixIcon?: React.ReactNode;
  prefixIconColor?: "success" | "error" | "warning" | "info" | (string & {});
  suffixIcon?: React.ReactNode;
  suffixIconColor?: "success" | "error" | "warning" | "info" | (string & {});
  revealable?: boolean;
  label?: string;
  mask?: string;
  stripCharacters?: string;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  length?: number;
  step?: number;
  placeholder?: string;
  disabledDates?: string[]
  disabledDateTimes?: string[]
}

const SEMANTIC_COLORS: Record<string, string> = {
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      inputType,
      inputMode,
      datalist,
      autocapitalize,
      prefix,
      suffix,
      required,
      error,
      regexValidation,
      prefixIcon,
      prefixIconColor,
      suffixIcon,
      suffixIconColor,
      revealable,
      label,
      mask,
      stripCharacters,
      readOnly,
      minLength,
      maxLength,
      length,
      step,
      onChange,
      value,
      defaultValue,
      id,
      placeholder,
      disabledDates,
      disabledDateTimes,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string>(
      String(value ?? defaultValue ?? ""),
    );
    const [validationError, setValidationError] = React.useState<string | null>(
      null,
    );
    const displayError = error ?? validationError;

    const inputId = id || React.useId();
    const datalistId = datalist ? `${inputId}-datalist` : undefined;

    const getActualType = () => {
      if (inputType === "password") return showPassword ? "text" : "password";
      if (inputType === "numeric" || inputType === "integer") return "text";
      if (inputType === "dateTime") return "datetime-local";
      if (inputType) return inputType;
      return type || "text";
    };

    const getInputMode =
      (): React.HTMLAttributes<HTMLInputElement>["inputMode"] => {
        if (inputMode) return inputMode;
        if (inputType === "numeric" || inputType === "integer")
          return "numeric";
        if (inputType === "email") return "email";
        if (inputType === "tel") return "tel";
        if (inputType === "url") return "url";
        return undefined;
      };

    const getAutoCapitalize = () => {
      if (typeof autocapitalize === "boolean")
        return autocapitalize ? "on" : "off";
      return autocapitalize;
    };

    const applyMask = (inputValue: string, maskPattern: string): string => {
      let result = "";
      let vi = 0;
      for (let i = 0; i < maskPattern.length && vi < inputValue.length; i++) {
        const mc = maskPattern[i];
        if (mc === "9") {
          if (/\d/.test(inputValue[vi])) result += inputValue[vi++];
          else break;
        } else if (mc === "A") {
          if (/[a-zA-Z]/.test(inputValue[vi])) result += inputValue[vi++];
          else break;
        } else if (mc === "*") {
          result += inputValue[vi++];
        } else {
          result += mc;
          if (inputValue[vi] === mc) vi++;
        }
      }
      return result;
    };

    const stripChars = (v: string, chars: string) =>
      v.replace(
        new RegExp(`[${chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`, "g"),
        "",
      );

    const validateRegex = (v: string) => {
      if (!regexValidation || !v) {
        setValidationError(null);
        return;
      }
      if (!regexValidation.pattern.test(v)) {
        setValidationError(regexValidation.message || "Invalid format");
      } else {
        setValidationError(null);
      }
    };

    const validateDisabled = (v: string): boolean => {
      if (inputType === "date" && disabledDates?.includes(v)) {
        setValidationError("This date is not available")
        return false
      }
      if (inputType === "dateTime" && disabledDateTimes?.includes(v)) {
        setValidationError("This date & time is not available")
        return false
      }
      return true
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value;
      if (stripCharacters) v = stripChars(v, stripCharacters);
      if (mask) v = applyMask(v, mask);
      if (inputType === "integer") v = v.replace(/[^\d-]/g, "");
      else if (inputType === "numeric") v = v.replace(/[^\d.-]/g, "");
      const maxLen = length || maxLength;
      if (maxLen && v.length > maxLen) v = v.slice(0, maxLen);
      if (!validateDisabled(v)) {
        setInternalValue("")
        return
      }
      setInternalValue(v);
      validateRegex(v);
      if (onChange)
        onChange({
          ...e,
          target: { ...e.target, value: v },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    React.useEffect(() => {
      if (value !== undefined) setInternalValue(String(value));
    }, [value]);

    const iconColor = suffixIconColor
      ? (SEMANTIC_COLORS[suffixIconColor] ?? suffixIconColor)
      : undefined;
    const prefixIconColorResolved = prefixIconColor
      ? (SEMANTIC_COLORS[prefixIconColor] ?? prefixIconColor)
      : undefined;

    const isDateType =
      inputType === "date" || inputType === "dateTime" || inputType === "time";
    const hasLeftAddon = prefix || prefixIcon;
    const hasRightAddon = suffix || suffixIcon;
    const hasReveal = inputType === "password" && revealable;
    const [pickerOpen, setPickerOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const pickerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (!pickerOpen) return
      const handler = (e: MouseEvent) => {
        const inContainer = containerRef.current?.contains(e.target as Node)
        const inPicker = pickerRef.current?.contains(e.target as Node)
        if (!inContainer && !inPicker) setPickerOpen(false)
      }
      document.addEventListener("mousedown", handler)
      return () => document.removeEventListener("mousedown", handler)
    }, [pickerOpen])

    const getDisplayValue = () => {
      if (!internalValue || !isDateType) return internalValue
      try {
        if (inputType === "date") {
          const [y, m, d] = internalValue.split("-")
          return `${m}/${d}/${y}`
        }
        if (inputType === "dateTime") {
          const [datePart, timePart] = internalValue.split("T")
          const [y, m, d] = datePart.split("-")
          return `${m}/${d}/${y} ${timePart}`
        }
        return internalValue
      } catch { return internalValue }
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center" ref={containerRef}>
          {prefixIcon && (
            <span
              className="absolute left-3 text-muted-foreground pointer-events-none z-10"
              style={prefixIconColorResolved ? { color: prefixIconColorResolved } : undefined}
            >
              {prefixIcon}
            </span>
          )}
          {!prefixIcon && prefix && (
            <span className="absolute left-3 text-muted-foreground text-sm pointer-events-none z-10">
              {prefix}
            </span>
          )}

          <input
            type={isDateType ? "text" : getActualType()}
            inputMode={getInputMode()}
            autoCapitalize={getAutoCapitalize()}
            list={datalistId}
            readOnly={isDateType ? true : readOnly}
            minLength={minLength}
            maxLength={length || maxLength}
            step={step}
            id={inputId}
            placeholder={
              placeholder ??
              (inputType === "date" ? "MM/DD/YYYY" :
               inputType === "dateTime" ? "MM/DD/YYYY HH:mm" :
               inputType === "time" ? "HH:mm" : undefined)
            }
            className={cn(
              "flex h-10 w-full rounded-xl border bg-background/50 backdrop-blur-sm px-3 py-5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-background/80  dark:bg-gray-400/5 dark:hover:bg-gray-400/25 dark:focus:bg-gray-400/20",
              hasLeftAddon && "pl-10",
              (hasRightAddon || hasReveal) && "pr-10",
              (readOnly || isDateType) && "bg-muted cursor-pointer",
              displayError &&
                "border-destructive focus-visible:ring-destructive",
              className,
            )}
            ref={ref}
            required={required}
            aria-required={required}
            aria-invalid={!!displayError}
            value={isDateType ? getDisplayValue() : internalValue}
            onChange={isDateType ? undefined : handleChange}
            onClick={isDateType ? () => setPickerOpen(true) : undefined}
            {...props}
          />

          {hasRightAddon &&
            !hasReveal &&
            (isDateType && suffixIcon ? (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
                tabIndex={-1}
                aria-label="Open picker"
                style={iconColor ? { color: iconColor } : undefined}
              >
                {suffixIcon}
              </button>
            ) : (
              <span
                className="absolute right-3 text-muted-foreground text-sm pointer-events-none z-10"
                style={iconColor ? { color: iconColor } : undefined}
              >
                {suffixIcon || suffix}
              </span>
            ))}

          {/* Custom date/time picker popup */}
          {isDateType && pickerOpen && (
            <DatePickerPopup
              mode={inputType as "date" | "dateTime" | "time"}
              value={internalValue}
              disabledDates={disabledDates}
              disabledDateTimes={disabledDateTimes}
              anchorEl={containerRef.current}
              popupRef={pickerRef}
              onChange={(v) => {
                setInternalValue(v)
                setValidationError(null)
                if (onChange) onChange({ target: { value: v } } as React.ChangeEvent<HTMLInputElement>)
              }}
              onClose={() => setPickerOpen(false)}
            />
          )}

          {hasReveal && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {datalist && datalist.length > 0 && (
          <datalist id={datalistId}>
            {datalist.map((opt, i) => (
              <option key={i} value={opt} />
            ))}
          </datalist>
        )}

        {displayError && (
          <p className="text-sm text-destructive mt-1">{displayError}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
