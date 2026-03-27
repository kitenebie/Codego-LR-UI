import * as React from "react"
import { Bold, Italic, Underline, List, ListOrdered, Link, Heading2, Heading3, Quote, Code, Undo, Redo } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface RichTextEditorProps {
  value?: string
  defaultValue?: string
  onChange?: (html: string) => void
  placeholder?: string
  minHeight?: string
  disabled?: boolean
  className?: string
}

interface ToolbarBtn {
  icon: React.ReactNode
  command: string
  value?: string
  title: string
}

const TOOLBAR: (ToolbarBtn | "divider")[] = [
  { icon: <Undo className="h-3.5 w-3.5" />,        command: "undo",            title: "Undo" },
  { icon: <Redo className="h-3.5 w-3.5" />,         command: "redo",            title: "Redo" },
  "divider",
  { icon: <Heading2 className="h-3.5 w-3.5" />,     command: "formatBlock",     value: "h2",   title: "Heading 2" },
  { icon: <Heading3 className="h-3.5 w-3.5" />,     command: "formatBlock",     value: "h3",   title: "Heading 3" },
  "divider",
  { icon: <Bold className="h-3.5 w-3.5" />,         command: "bold",            title: "Bold" },
  { icon: <Italic className="h-3.5 w-3.5" />,       command: "italic",          title: "Italic" },
  { icon: <Underline className="h-3.5 w-3.5" />,    command: "underline",       title: "Underline" },
  { icon: <Code className="h-3.5 w-3.5" />,         command: "formatBlock",     value: "pre",  title: "Code block" },
  "divider",
  { icon: <List className="h-3.5 w-3.5" />,         command: "insertUnorderedList", title: "Bullet list" },
  { icon: <ListOrdered className="h-3.5 w-3.5" />,  command: "insertOrderedList",   title: "Numbered list" },
  { icon: <Quote className="h-3.5 w-3.5" />,        command: "formatBlock",     value: "blockquote", title: "Quote" },
  "divider",
  { icon: <Link className="h-3.5 w-3.5" />,         command: "createLink",      title: "Insert link" },
]

export function RichTextEditor({
  value: controlled,
  defaultValue = "",
  onChange,
  placeholder = "Start typing...",
  minHeight = "160px",
  disabled = false,
  className,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const [focused, setFocused] = React.useState(false)
  const [isEmpty, setIsEmpty] = React.useState(!defaultValue)

  React.useEffect(() => {
    if (editorRef.current && controlled !== undefined) {
      if (editorRef.current.innerHTML !== controlled) {
        editorRef.current.innerHTML = controlled
      }
    }
  }, [controlled])

  React.useEffect(() => {
    if (editorRef.current && defaultValue) {
      editorRef.current.innerHTML = defaultValue
      setIsEmpty(false)
    }
  }, [])

  function exec(command: string, value?: string) {
    if (command === "createLink") {
      const url = prompt("Enter URL:")
      if (url) document.execCommand("createLink", false, url)
    } else {
      document.execCommand(command, false, value)
    }
    editorRef.current?.focus()
  }

  function handleInput() {
    const html = editorRef.current?.innerHTML ?? ""
    setIsEmpty(!html || html === "<br>")
    onChange?.(html)
  }

  function isActive(command: string, value?: string) {
    try {
      if (value) return document.queryCommandValue(command) === value
      return document.queryCommandState(command)
    } catch { return false }
  }

  return (
    <div className={cn(
      "rounded-xl border border-border overflow-hidden transition-colors dark:border-white/30 dark:bg-gray-400/5",
      focused && "ring-2 ring-ring border-primary",
      disabled && "opacity-50 pointer-events-none",
      className
    )}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
        {TOOLBAR.map((item, i) =>
          item === "divider" ? (
            <span key={i} className="mx-1 h-4 w-px bg-border" />
          ) : (
            <button
              key={i}
              type="button"
              title={item.title}
              onMouseDown={(e) => { e.preventDefault(); exec(item.command, item.value) }}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded transition-colors",
                isActive(item.command, item.value)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon}
            </button>
          )
        )}
      </div>

      {/* Editable area */}
      <div className="relative">
        {isEmpty && !focused && (
          <p className="absolute top-3 left-4 text-sm text-muted-foreground pointer-events-none select-none">{placeholder}</p>
        )}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "outline-none px-4 py-3 text-sm",
            "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2",
            "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
            "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
            "[&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
            "[&_pre]:bg-muted [&_pre]:rounded [&_pre]:px-2 [&_pre]:py-1 [&_pre]:font-mono [&_pre]:text-xs",
            "[&_a]:text-primary [&_a]:underline",
          )}
          style={{ minHeight }}
        />
      </div>
    </div>
  )
}
