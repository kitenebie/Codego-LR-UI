import { Calendar, Clock, Phone, Search } from "lucide-react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Input } from "../components/ui/input"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "label",       label: "Label" },
  { id: "placeholder", label: "Placeholder" },
  { id: "defaultvalue",label: "Default Value" },
  { id: "inputtype",   label: "Input Type" },
  { id: "datepicker",  label: "Date / Time" },
  { id: "inputmode",   label: "Input Mode" },
  { id: "datalist",    label: "Datalist" },
  { id: "autocap",     label: "Autocapitalize" },
  { id: "prefix",      label: "Prefix" },
  { id: "prefixicon",  label: "Prefix Icon" },
  { id: "suffix",      label: "Suffix" },
  { id: "suffixicon",  label: "Suffix Icon" },
  { id: "iconcolor",   label: "Icon Color" },
  { id: "revealable",  label: "Revealable" },
  { id: "mask",        label: "Mask" },
  { id: "strip",       label: "Strip Characters" },
  { id: "regex",       label: "Regex Validation" },
  { id: "readonly",    label: "Read Only" },
  { id: "minlength",   label: "Min Length" },
  { id: "maxlength",   label: "Max Length" },
  { id: "length",      label: "Length" },
  { id: "step",        label: "Step" },
  { id: "allprops",    label: "All Props Combined" },
  { id: "validation",  label: "Validation" },
  { id: "props",       label: "Props" },
]

export function InputDocs() {
  return (
    <DocsLayout toc={TOC}>

      <Section id="label"><Playground
        title="label"
        description="Renders a <label> element above the input, automatically linked via htmlFor."
        code={`<Input label="API Key" placeholder="Enter your key" />`}
      >
        <div className="w-full max-w-sm">
          <Input label="API Key" placeholder="Enter your key" />
        </div>
      </Playground></Section>

      {/* ── placeholder ── */}
      <Section id="placeholder"><Playground
        title="placeholder"
        description="Hint text shown inside the input when it is empty."
        code={`<Input placeholder="MM/DD/YYYY" />`}
      >
        <div className="w-full max-w-sm">
          <Input placeholder="MM/DD/YYYY" />
        </div>
      </Playground></Section>

      {/* ── defaultValue ── */}
      <Section id="defaultvalue"><Playground
        title="defaultValue"
        description="Pre-fills the input with an initial value. Uncontrolled — the user can change it freely. Works for all inputTypes including date, dateTime, and time."
        code={`{/* Text */}
<Input label="Username" defaultValue="john_doe" />

{/* Numeric */}
<Input inputType="numeric" label="Price" defaultValue="99.99" />

{/* Password */}
<Input inputType="password" revealable label="Password" defaultValue="secret123" />

{/* Date */}
<Input inputType="date" label="Start Date" suffixIcon={<Calendar size={16} />} defaultValue="2025-07-21" />

{/* DateTime */}
<Input inputType="dateTime" label="Appointment" suffixIcon={<Calendar size={16} />} defaultValue="2025-07-21T09:00" />

{/* Time */}
<Input inputType="time" label="Time" suffixIcon={<Clock size={16} />} defaultValue="09:30" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input label="Username" defaultValue="john_doe" />
          <Input inputType="numeric" label="Price" defaultValue="99.99" />
          <Input inputType="password" revealable label="Password" defaultValue="secret123" />
          <Input inputType="date"     label="Start Date"   suffixIcon={<Calendar size={16} />} defaultValue="2025-07-21" />
          <Input inputType="dateTime" label="Appointment"  suffixIcon={<Calendar size={16} />} defaultValue="2025-07-21T09:00" />
          <Input inputType="time"     label="Time"         suffixIcon={<Clock size={16} />}    defaultValue="09:30" />
        </div>
      </Playground></Section>

      {/* ── inputType ── */}
      <Section id="inputtype"><Playground
        title="inputType"
        description="Semantic input type. 'numeric' and 'integer' render as text with the correct mobile keyboard. 'password' hides the value."
        code={`<Input inputType="email"   label="Email"   placeholder="you@example.com" />
<Input inputType="numeric" label="Amount"  placeholder="0.00" />
<Input inputType="integer" label="Count"   placeholder="0" />
<Input inputType="tel"     label="Phone"   placeholder="+1 (555) 000-0000" />
<Input inputType="url"     label="Website" placeholder="https://example.com" />
<Input inputType="color"   label="Color" />
<Input inputType="password" label="Password" placeholder="••••••••" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input inputType="email"    label="Email"    placeholder="you@example.com" />
          <Input inputType="numeric"  label="Amount"   placeholder="0.00" />
          <Input inputType="integer"  label="Count"    placeholder="0" />
          <Input inputType="tel"      label="Phone"    placeholder="+1 (555) 000-0000" />
          <Input inputType="url"      label="Website"  placeholder="https://example.com" />
          <Input inputType="color"    label="Color" />
          <Input inputType="password" label="Password" placeholder="••••••••" />
        </div>
      </Playground></Section>

      {/* ── inputType date / dateTime / time ── */}
      <Section id="datepicker"><Playground
        title="inputType — date, dateTime, time"
        description="Custom calendar and time picker UI. Click the input or the icon to open. Disabled dates are crossed out in red. Disabled date-time slots are crossed out in the time grid."
        code={`import { Calendar, Clock } from "lucide-react"

{/* Date picker */}
<Input
  inputType="date"
  label="Date"
  suffixIcon={<Calendar size={16} />}
/>

{/* Date & time picker */}
<Input
  inputType="dateTime"
  label="Date & Time"
  suffixIcon={<Calendar size={16} />}
/>

{/* Time picker */}
<Input
  inputType="time"
  label="Time"
  suffixIcon={<Clock size={16} />}
/>

{/* Disabled specific dates */}
<Input
  inputType="date"
  label="Booking Date (weekends disabled)"
  suffixIcon={<Calendar size={16} />}
  disabledDates={["2025-07-19", "2025-07-20", "2025-07-26", "2025-07-27"]}
/>

{/* Disabled specific date-time slots */}
<Input
  inputType="dateTime"
  label="Appointment (some slots disabled)"
  suffixIcon={<Calendar size={16} />}
  disabledDateTimes={["2025-07-21T09:00", "2025-07-21T10:00"]}
/>`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input inputType="date"     label="Date"       suffixIcon={<Calendar size={16} />} />
          <Input inputType="dateTime" label="Date & Time" suffixIcon={<Calendar size={16} />} />
          <Input inputType="time"     label="Time"        suffixIcon={<Clock size={16} />} />
          <Input
            inputType="date"
            label="Booking Date (weekends disabled)"
            suffixIcon={<Calendar size={16} />}
            disabledDates={["2025-07-19", "2025-07-20", "2025-07-26", "2025-07-27"]}
          />
          <Input
            inputType="dateTime"
            label="Appointment (some slots disabled)"
            suffixIcon={<Calendar size={16} />}
            disabledDateTimes={["2025-07-21T09:00", "2025-07-21T10:00", "2025-07-22T14:00"]}
          />
        </div>
      </Playground></Section>

      {/* ── inputMode ── */}
      <Section id="inputmode"><Playground
        title="inputMode"
        description="Overrides the virtual keyboard hint sent to mobile browsers."
        code={`<Input inputMode="decimal" label="Decimal"  placeholder="3.14" />
<Input inputMode="numeric" label="Numeric"  placeholder="42" />
<Input inputMode="tel"     label="Tel"      placeholder="+1 555 000 0000" />
<Input inputMode="url"     label="URL"      placeholder="https://" />
<Input inputMode="email"   label="Email"    placeholder="you@example.com" />
<Input inputMode="search"  label="Search"   placeholder="Search…" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input inputMode="decimal" label="Decimal"  placeholder="3.14" />
          <Input inputMode="numeric" label="Numeric"  placeholder="42" />
          <Input inputMode="tel"     label="Tel"      placeholder="+1 555 000 0000" />
          <Input inputMode="url"     label="URL"      placeholder="https://" />
          <Input inputMode="email"   label="Email"    placeholder="you@example.com" />
          <Input inputMode="search"  label="Search"   placeholder="Search…" />
        </div>
      </Playground></Section>

      {/* ── datalist ── */}
      <Section id="datalist"><Playground
        title="datalist"
        description="Provides autocomplete suggestions via a native <datalist> element."
        code={`<Input
  label="Framework"
  placeholder="Type to search…"
  datalist={["React", "Vue", "Svelte", "Angular", "SolidJS"]}
/>`}
      >
        <div className="w-full max-w-sm">
          <Input
            label="Framework"
            placeholder="Type to search…"
            datalist={["React", "Vue", "Svelte", "Angular", "SolidJS"]}
          />
        </div>
      </Playground></Section>

      {/* ── autocapitalize ── */}
      <Section id="autocap"><Playground
        title="autocapitalize"
        description="Controls automatic capitalisation on mobile. Accepts boolean or 'none' | 'sentences' | 'words' | 'characters'."
        code={`<Input autocapitalize={false}       label="Off"         placeholder="no caps" />
<Input autocapitalize="words"       label="Words"       placeholder="Each Word" />
<Input autocapitalize="characters"  label="Characters"  placeholder="ALL CAPS" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input autocapitalize={false}      label="Off"        placeholder="no caps" />
          <Input autocapitalize="words"      label="Words"      placeholder="Each Word" />
          <Input autocapitalize="characters" label="Characters" placeholder="ALL CAPS" />
        </div>
      </Playground></Section>

      {/* ── prefix ── */}
      <Section id="prefix"><Playground
        title="prefix"
        description="Renders any ReactNode inside the input on the left side."
        code={`<Input prefix="https://" label="Website" placeholder="example.com" />
<Input prefix="$"        label="Price"   placeholder="0.00" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input prefix="https://" label="Website" placeholder="example.com" />
          <Input prefix="$"        label="Price"   placeholder="0.00" />
        </div>
      </Playground></Section>

      {/* ── prefixIcon ── */}
      <Section id="prefixicon"><Playground
        title="prefixIcon"
        description="Renders an icon component on the left side of the input. Use prefixIconColor to tint it."
        code={`import { Search, Phone } from "lucide-react"

<Input prefixIcon={<Search size={16} />} label="Search" placeholder="Search…" />
<Input prefixIcon={<Phone size={16} />} prefixIconColor="success" label="Phone" placeholder="+1 (555) 000-0000" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input prefixIcon={<Search size={16} />} label="Search" placeholder="Search…" />
          <Input prefixIcon={<Phone size={16} />} prefixIconColor="success" label="Phone" placeholder="+1 (555) 000-0000" />
        </div>
      </Playground></Section>

      {/* ── suffix ── */}
      <Section id="suffix"><Playground
        title="suffix"
        description="Renders any ReactNode inside the input on the right side."
        code={`<Input suffix=".com" label="Domain"   placeholder="yoursite" />
<Input suffix="kg"   label="Weight"   placeholder="0" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input suffix=".com" label="Domain" placeholder="yoursite" />
          <Input suffix="kg"   label="Weight" placeholder="0" />
        </div>
      </Playground></Section>

      {/* ── suffixIcon ── */}
      <Section id="suffixicon"><Playground
        title="suffixIcon"
        description="Renders an icon component on the right side of the input."
        code={`import { Phone } from "lucide-react"

<Input suffixIcon={<Phone size={16} />} label="Phone" placeholder="+1 (555) 000-0000" />`}
      >
        <div className="w-full max-w-sm">
          <Input suffixIcon={<Phone size={16} />} label="Phone" placeholder="+1 (555) 000-0000" />
        </div>
      </Playground></Section>

      {/* ── suffixIconColor ── */}
      <Section id="iconcolor"><Playground
        title="suffixIconColor"
        description="Colors the suffix icon. Accepts semantic tokens ('success' | 'error' | 'warning' | 'info') or any CSS color string."
        code={`<Input suffixIcon={<Phone size={16} />} suffixIconColor="success" label="Success"  placeholder="…" />
<Input suffixIcon={<Phone size={16} />} suffixIconColor="error"   label="Error"    placeholder="…" />
<Input suffixIcon={<Phone size={16} />} suffixIconColor="warning" label="Warning"  placeholder="…" />
<Input suffixIcon={<Phone size={16} />} suffixIconColor="info"    label="Info"     placeholder="…" />
<Input suffixIcon={<Phone size={16} />} suffixIconColor="#f59e0b" label="Hex color" placeholder="…" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input suffixIcon={<Phone size={16} />} suffixIconColor="success"  label="Success"   placeholder="…" />
          <Input suffixIcon={<Phone size={16} />} suffixIconColor="error"    label="Error"     placeholder="…" />
          <Input suffixIcon={<Phone size={16} />} suffixIconColor="warning"  label="Warning"   placeholder="…" />
          <Input suffixIcon={<Phone size={16} />} suffixIconColor="info"     label="Info"      placeholder="…" />
          <Input suffixIcon={<Phone size={16} />} suffixIconColor="#f59e0b"  label="Hex color" placeholder="…" />
        </div>
      </Playground></Section>

      {/* ── revealable ── */}
      <Section id="revealable"><Playground
        title="revealable"
        description="Adds a show/hide toggle button when inputType='password'."
        code={`<Input inputType="password" revealable label="Password" placeholder="••••••••" />`}
      >
        <div className="w-full max-w-sm">
          <Input inputType="password" revealable label="Password" placeholder="••••••••" />
        </div>
      </Playground></Section>

      {/* ── mask ── */}
      <Section id="mask"><Playground
        title="mask"
        description="Formats the value as the user types. Use '9' for digits, 'A' for letters, '*' for any character. Other characters are treated as fixed separators."
        code={`<Input mask="99/99/9999" label="Date"        placeholder="MM/DD/YYYY" />
<Input mask="(999) 999-9999" label="Phone"    placeholder="(555) 000-0000" />
<Input mask="AAA-9999"       label="Code"     placeholder="ABC-1234" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input mask="99/99/9999"     label="Date"  placeholder="MM/DD/YYYY" />
          <Input mask="(999) 999-9999" label="Phone" placeholder="(555) 000-0000" />
          <Input mask="AAA-9999"       label="Code"  placeholder="ABC-1234" />
        </div>
      </Playground></Section>

      {/* ── stripCharacters ── */}
      <Section id="strip"><Playground
        title="stripCharacters"
        description="Removes specified characters from the value on every keystroke."
        code={`<Input stripCharacters="," label="Number (no commas)" placeholder="1000000" />
<Input stripCharacters=" " label="No spaces"        placeholder="hello world" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input stripCharacters="," label="Number (no commas)" placeholder="1,000,000" />
          <Input stripCharacters=" " label="No spaces"          placeholder="hello world" />
        </div>
      </Playground></Section>

      {/* ── regexValidation ── */}
      <Section id="regex"><Playground
        title="regexValidation"
        description="Validates the value against a RegExp on every change. Shows an error message below the input when invalid."
        code={`{/* Email */}
<Input label="Email" placeholder="you@example.com"
  regexValidation={{ pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: "Enter a valid email address" }} />

{/* URL */}
<Input label="URL" placeholder="https://example.com"
  regexValidation={{ pattern: /^https?:\\/\\/[^\\s$.?#].[^\\s]*$/, message: "Enter a valid URL" }} />

{/* US Phone — combine with mask */}
<Input label="US Phone" placeholder="(555) 000-0000" mask="(999) 999-9999"
  regexValidation={{ pattern: /^\\(\\d{3}\\) \\d{3}-\\d{4}$/, message: "Enter a valid US phone number" }} />

{/* ZIP Code */}
<Input label="ZIP Code" placeholder="12345"
  regexValidation={{ pattern: /^\\d{5}(-\\d{4})?$/, message: "Enter a valid ZIP code" }} />

{/* Strong Password */}
<Input label="Password" inputType="password" revealable placeholder="Min 8 chars"
  regexValidation={{ pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$/, message: "Min 8 chars, upper, lower, number & symbol" }} />

{/* Username */}
<Input label="Username" placeholder="john_doe"
  regexValidation={{ pattern: /^[a-zA-Z0-9_]{3,20}$/, message: "3–20 chars: letters, numbers or underscores" }} />

{/* IPv4 Address */}
<Input label="IPv4 Address" placeholder="192.168.0.1"
  regexValidation={{ pattern: /^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)){3}$/, message: "Enter a valid IPv4 address" }} />

{/* Hex Color */}
<Input label="Hex Color" placeholder="#ff0000"
  regexValidation={{ pattern: /^#[0-9a-fA-F]{6}$/, message: "Must be a valid hex color (e.g. #ff0000)" }} />

{/* Credit Card */}
<Input label="Credit Card" placeholder="4111111111111111"
  regexValidation={{ pattern: /^\\d{13,19}$/, message: "Enter a valid card number (13–19 digits)" }} />

{/* Date MM/DD/YYYY — combine with mask */}
<Input label="Date" placeholder="MM/DD/YYYY" mask="99/99/9999"
  regexValidation={{ pattern: /^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}$/, message: "Enter a valid date MM/DD/YYYY" }} />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input label="Email" placeholder="you@example.com"
            regexValidation={{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" }} />
          <Input label="URL" placeholder="https://example.com"
            regexValidation={{ pattern: /^https?:\/\/[^\s$.?#].[^\s]*$/, message: "Enter a valid URL" }} />
          <Input label="US Phone" placeholder="(555) 000-0000" mask="(999) 999-9999"
            regexValidation={{ pattern: /^\(\d{3}\) \d{3}-\d{4}$/, message: "Enter a valid US phone number" }} />
          <Input label="ZIP Code" placeholder="12345"
            regexValidation={{ pattern: /^\d{5}(-\d{4})?$/, message: "Enter a valid ZIP code" }} />
          <Input label="Password" inputType="password" revealable placeholder="Min 8 chars"
            regexValidation={{ pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, message: "Min 8 chars, upper, lower, number & symbol" }} />
          <Input label="Username" placeholder="john_doe"
            regexValidation={{ pattern: /^[a-zA-Z0-9_]{3,20}$/, message: "3–20 chars: letters, numbers or underscores" }} />
          <Input label="IPv4 Address" placeholder="192.168.0.1"
            regexValidation={{ pattern: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/, message: "Enter a valid IPv4 address" }} />
          <Input label="Hex Color" placeholder="#ff0000"
            regexValidation={{ pattern: /^#[0-9a-fA-F]{6}$/, message: "Must be a valid hex color (e.g. #ff0000)" }} />
          <Input label="Credit Card" placeholder="4111111111111111"
            regexValidation={{ pattern: /^\d{13,19}$/, message: "Enter a valid card number (13–19 digits)" }} />
          <Input label="Date" placeholder="MM/DD/YYYY" mask="99/99/9999"
            regexValidation={{ pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, message: "Enter a valid date MM/DD/YYYY" }} />
        </div>
      </Playground></Section>

      {/* ── readOnly ── */}
      <Section id="readonly"><Playground
        title="readOnly"
        description="Makes the input non-editable. Applies a muted background to signal the state visually."
        code={`<Input readOnly label="Read Only" value="Cannot be changed" />`}
      >
        <div className="w-full max-w-sm">
          <Input readOnly label="Read Only" value="Cannot be changed" />
        </div>
      </Playground></Section>

      {/* ── minLength ── */}
      <Section id="minlength"><Playground
        title="minLength"
        description="Sets the minimum number of characters required (native HTML validation)."
        code={`<Input minLength={2} label="Username" placeholder="At least 2 characters" />`}
      >
        <div className="w-full max-w-sm">
          <Input minLength={2} label="Username" placeholder="At least 2 characters" />
        </div>
      </Playground></Section>

      {/* ── maxLength ── */}
      <Section id="maxlength"><Playground
        title="maxLength"
        description="Limits input to a maximum number of characters."
        code={`<Input maxLength={255} label="Bio" placeholder="Max 255 characters" />`}
      >
        <div className="w-full max-w-sm">
          <Input maxLength={255} label="Bio" placeholder="Max 255 characters" />
        </div>
      </Playground></Section>

      {/* ── length ── */}
      <Section id="length"><Playground
        title="length"
        description="Hard-caps the value to an exact character count, overriding maxLength."
        code={`<Input length={8} label="PIN" placeholder="8 characters exactly" />`}
      >
        <div className="w-full max-w-sm">
          <Input length={8} label="PIN" placeholder="8 characters exactly" />
        </div>
      </Playground></Section>

      {/* ── step ── */}
      <Section id="step"><Playground
        title="step"
        description="Sets the increment step for numeric inputs."
        code={`<Input type="number" step={10} label="Step 10" placeholder="0" />`}
      >
        <div className="w-full max-w-sm">
          <Input type="number" step={10} label="Step 10" placeholder="0" />
        </div>
      </Playground></Section>

      {/* ── All props combined ── */}
      <Section id="allprops"><Playground
        title="All Props Combined"
        description="A comprehensive example using multiple props together."
        code={`<Input
  label="Phone Number"
  placeholder="(555) 000-0000"
  inputType="tel"
  mask="(999) 999-9999"
  stripCharacters=" "
  suffixIcon={<Phone size={16} />}
  suffixIconColor="success"
  minLength={2}
  maxLength={14}
  autocapitalize={false}
  regexValidation={{
    pattern: /^\\(\\d{3}\\) \\d{3}-\\d{4}$/,
    message: "Enter a valid US phone number",
  }}
/>`}
      >
        <div className="w-full max-w-sm">
          <Input
            label="Phone Number"
            placeholder="(555) 000-0000"
            inputType="tel"
            mask="(999) 999-9999"
            stripCharacters=" "
            suffixIcon={<Phone size={16} />}
            suffixIconColor="success"
            minLength={2}
            maxLength={14}
            autocapitalize={false}
            regexValidation={{
              pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
              message: "Enter a valid US phone number",
            }}
          />
        </div>
      </Playground></Section>

      <Section id="validation"><Playground
        title="Validation"
        description="Use required to mark a field as required (shows * indicator). Use error to display an external validation message."
        code={`<Input label="Username" required placeholder="Required field" />
<Input label="Email" required error="This field is required" placeholder="you@example.com" />`}
      >
        <div className="w-full max-w-sm space-y-3">
          <Input label="Username" required placeholder="Required field" />
          <Input label="Email" required error="This field is required" placeholder="you@example.com" />
        </div>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "label",            type: "string",                                                                    description: "Label rendered above the input." },
        { prop: "inputType",        type: '"email" | "numeric" | "integer" | "password" | "tel" | "url" | "color" | "date" | "dateTime" | "time"', description: "Semantic input type. numeric/integer use text with correct mobile keyboard." },
        { prop: "inputMode",        type: '"decimal" | "text" | "numeric" | "tel" | "url" | "email" | "search" | "none"', description: "Override the virtual keyboard hint." },
        { prop: "placeholder",      type: "string",                                                                    description: "Hint text shown when empty." },
        { prop: "prefix",           type: "ReactNode",                                                                 description: "Content rendered inside the input on the left." },
        { prop: "suffix",           type: "ReactNode",                                                                 description: "Content rendered inside the input on the right." },
        { prop: "prefixIcon",       type: "ReactNode",                                                                 description: "Icon on the left side." },
        { prop: "prefixIconColor",  type: '"success" | "error" | "warning" | "info" | string',                        description: "Color for the prefix icon." },
        { prop: "suffixIcon",       type: "ReactNode",                                                                 description: "Icon on the right side." },
        { prop: "suffixIconColor",  type: '"success" | "error" | "warning" | "info" | string',                        description: "Color for the suffix icon." },
        { prop: "revealable",       type: "boolean",                                                                   description: "Show/hide toggle for password inputs." },
        { prop: "mask",             type: "string",                                                                    description: "Input mask pattern. 9=digit, A=letter, *=any." },
        { prop: "stripCharacters",  type: "string",                                                                    description: "Characters to remove on every keystroke." },
        { prop: "regexValidation",  type: "{ pattern: RegExp; message?: string }",                                     description: "Validate value against a RegExp on change." },
        { prop: "datalist",         type: "string[]",                                                                  description: "Autocomplete suggestions via native datalist." },
        { prop: "autocapitalize",   type: '"none" | "sentences" | "words" | "characters" | boolean',                  description: "Mobile autocapitalize hint." },
        { prop: "readOnly",         type: "boolean",                                                                   description: "Make the input non-editable." },
        { prop: "minLength",        type: "number",                                                                    description: "Minimum character count (native validation)." },
        { prop: "maxLength",        type: "number",                                                                    description: "Maximum character count." },
        { prop: "length",           type: "number",                                                                    description: "Exact character cap — overrides maxLength." },
        { prop: "step",             type: "number",                                                                    description: "Increment step for numeric inputs." },
        { prop: "disabledDates",    type: "string[]",                                                                  description: "Dates to disable in the date picker (YYYY-MM-DD)." },
        { prop: "disabledDateTimes",type: "string[]",                                                                  description: "Date-time slots to disable (YYYY-MM-DDTHH:mm)." },
        { prop: "required",         type: "boolean",                                                                   description: "Marks the field as required. Shows a * indicator next to the label." },
        { prop: "error",            type: "string",                                                                    description: "External error message displayed below the input." },
      ]} /></Section>
    </DocsLayout>
  )
}
