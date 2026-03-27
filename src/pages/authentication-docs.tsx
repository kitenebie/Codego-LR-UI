import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Authentication } from "../components/ui/authentication"
import { PropsTable } from "../components/ui/props-table"
import { Input } from "../components/ui/input"
import { Select } from "../components/ui/select"
import { LogIn, Zap } from "lucide-react"

const TOC = [
  { id: "login-only",        label: "Login Only" },
  { id: "register-only",     label: "Register Only" },
  { id: "full",              label: "Login + Register + Reset" },
  { id: "login-fields",      label: "Custom Login Fields" },
  { id: "register-fields",   label: "Custom Register Fields" },
  { id: "reset-fields",      label: "Custom Reset Fields" },
  { id: "field-states",      label: "Field States (error / disabled)" },
  { id: "custom-fields",     label: "Custom Fields (render)" },
  { id: "with-logo",         label: "With Logo & Title" },
  { id: "variant-glass",     label: "Variant: Glass" },
  { id: "variant-split",     label: "Variant: Split" },
  { id: "variant-minimal",   label: "Variant: Minimal" },
  { id: "props",             label: "Authentication Props" },
  { id: "authfield",         label: "AuthField Props" },
]

export function AuthenticationDocs() {
  const [lastEvent, setLastEvent] = useState<string | null>(null)

  const onErr = (view: string, err: any) =>
    setLastEvent(`${view} error: ${err?.response?.data?.message ?? "request failed"}`)

  return (
    <DocsLayout toc={TOC}>

      <Section id="login-only">
        <Playground
          title="Login Only"
          description="Show only the login form by disabling register and reset password. Tab is hidden when only one view is active."
          code={`<Authentication
  enableRegister={false}
  enableResetPassword={false}
  baseURL="https://api.example.com"
  onLoginSuccess={(data) => console.log(data)}
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              enableRegister={false}
              enableResetPassword={false}
              baseURL=""
              onLoginSuccess={() => setLastEvent("login success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="register-only">
        <Playground
          title="Register Only"
          description="Show only the registration form. Tab is hidden when only one view is active."
          code={`<Authentication
  enableLogin={false}
  enableResetPassword={false}
  defaultView="register"
  baseURL="https://api.example.com"
  onRegisterSuccess={(data) => console.log(data)}
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              enableLogin={false}
              enableResetPassword={false}
              defaultView="register"
              baseURL=""
              onRegisterSuccess={() => setLastEvent("register success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="full">
        <Playground
          title="Login + Register + Reset Password"
          description="Full authentication flow with all three views enabled."
          code={`<Authentication
  enableLogin
  enableRegister
  enableResetPassword
  baseURL="https://api.example.com"
  onLoginSuccess={(data) => console.log("login", data)}
  onRegisterSuccess={(data) => console.log("register", data)}
  onResetSuccess={(data) => console.log("reset", data)}
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              enableLogin
              enableRegister
              enableResetPassword
              baseURL=""
              onLoginSuccess={() => setLastEvent("login success")}
              onRegisterSuccess={() => setLastEvent("register success")}
              onResetSuccess={() => setLastEvent("reset success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="login-fields">
        <Playground
          title="Custom Login Fields"
          description="Override loginFields to control field types, placeholders, required state, and add extra fields."
          code={`<Authentication
  enableRegister={false}
  enableResetPassword={false}
  baseURL="https://api.example.com"
  loginFields={[
    { name: "email",    label: "Email",    type: "email",    required: true, placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", required: true, revealable: true },
  ]}
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              enableRegister={false}
              enableResetPassword={false}
              baseURL=""
              loginFields={[
                { name: "email",    label: "Email",    type: "email",    required: true, placeholder: "you@example.com" },
                { name: "password", label: "Password", type: "password", required: true, revealable: true },
              ]}
              onLoginSuccess={() => setLastEvent("login success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="register-fields">
        <Playground
          title="Custom Register Fields"
          description="Override registerFields to add or remove fields, set validation, and control required state."
          code={`<Authentication
  enableLogin={false}
  enableResetPassword={false}
  defaultView="register"
  baseURL="https://api.example.com"
  registerFields={[
    { name: "first_name", label: "First Name", type: "text",     required: true },
    { name: "last_name",  label: "Last Name",  type: "text",     required: true },
    { name: "email",      label: "Email",      type: "email",    required: true },
    { name: "phone",      label: "Phone",      type: "tel",      placeholder: "+1 (555) 000-0000" },
    { name: "password",   label: "Password",   type: "password", required: true, revealable: true },
    { name: "password_confirmation", label: "Confirm Password", type: "password", required: true, revealable: true },
  ]}
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              enableLogin={false}
              enableResetPassword={false}
              defaultView="register"
              baseURL=""
              registerFields={[
                { name: "first_name", label: "First Name", type: "text",     required: true },
                { name: "last_name",  label: "Last Name",  type: "text",     required: true },
                { name: "email",      label: "Email",      type: "email",    required: true },
                { name: "phone",      label: "Phone",      type: "tel",      placeholder: "+1 (555) 000-0000" },
                { name: "password",   label: "Password",   type: "password", required: true, revealable: true },
                { name: "password_confirmation", label: "Confirm Password", type: "password", required: true, revealable: true },
              ]}
              onRegisterSuccess={() => setLastEvent("register success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="reset-fields">
        <Playground
          title="Custom Reset Fields"
          description="Override resetPasswordFields to customise the reset password view — e.g. add a username field alongside email."
          code={`<Authentication
  enableLogin={false}
  enableRegister={false}
  defaultView="resetPassword"
  baseURL="https://api.example.com"
  resetPasswordFields={[
    { name: "email",    label: "Email",    type: "email", required: true, placeholder: "you@example.com" },
    { name: "username", label: "Username", type: "text",  required: true, placeholder: "your_username" },
  ]}
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              enableLogin={false}
              enableRegister={false}
              defaultView="resetPassword"
              baseURL=""
              resetPasswordFields={[
                { name: "email",    label: "Email",    type: "email", required: true, placeholder: "you@example.com" },
                { name: "username", label: "Username", type: "text",  required: true, placeholder: "your_username" },
              ]}
              onResetSuccess={() => setLastEvent("reset success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="field-states">
        <Playground
          title="Field States (error / disabled)"
          description="Use error to show inline validation messages and disabled to lock individual fields."
          code={`<Authentication
  enableRegister={false}
  enableResetPassword={false}
  baseURL="https://api.example.com"
  loginFields={[
    { name: "email",    label: "Email",    type: "email",    required: true, error: "This email is not registered." },
    { name: "password", label: "Password", type: "password", required: true, revealable: true, disabled: true },
  ]}
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              enableRegister={false}
              enableResetPassword={false}
              baseURL=""
              loginFields={[
                { name: "email",    label: "Email",    type: "email",    required: true, error: "This email is not registered." },
                { name: "password", label: "Password", type: "password", required: true, revealable: true, disabled: true },
              ]}
              onLoginSuccess={() => setLastEvent("login success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="custom-fields">
        <Playground
          title="Custom Fields (render)"
          description="Use the render prop on any AuthField to inject any React UI element — Select, custom Input, etc."
          code={`<Authentication
  enableRegister={false}
  enableResetPassword={false}
  baseURL="https://api.example.com"
  loginFields={[
    { name: "email", label: "Email" },
    { name: "password", label: "Password" },
    {
      name: "role",
      label: "Role",
      render: (value, onChange) => (
        <Select
          value={value}
          onChange={onChange}
          options={[
            { label: "Admin", value: "admin" },
            { label: "User",  value: "user" },
          ]}
        />
      ),
    },
  ]}
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              enableRegister={false}
              enableResetPassword={false}
              baseURL=""
              loginFields={[
                { name: "email", label: "Email" },
                { name: "password", label: "Password" },
                {
                  name: "role",
                  label: "Role",
                  render: (value, onChange) => (
                    <Select
                      value={value}
                      onChange={onChange}
                      options={[
                        { label: "Admin", value: "admin" },
                        { label: "User",  value: "user" },
                        { label: "Guest", value: "guest" },
                      ]}
                      placeholder="Select role..."
                    />
                  ),
                },
                {
                  name: "otp",
                  label: "2FA Code (optional)",
                  render: (value, onChange) => (
                    <Input
                      placeholder="000000"
                      maxLength={6}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  ),
                },
              ]}
              onLoginSuccess={() => setLastEvent("custom login success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="with-logo">
        <Playground
          title="With Logo & Title"
          description="Pass a logo node and a custom title to brand the auth card."
          code={`<Authentication
  logo={<LogIn className="h-10 w-10 text-primary" />}
  title="Welcome to MyApp"
  enableRegister={false}
  enableResetPassword={false}
  baseURL="https://api.example.com"
/>`}
        >
          <div className="w-full max-w-md mx-auto">
            <Authentication
              logo={<LogIn className="h-10 w-10 text-primary" />}
              title="Welcome to MyApp"
              enableRegister={false}
              enableResetPassword={false}
              baseURL=""
              onLoginSuccess={() => setLastEvent("login success")}
              onError={onErr}
              className="min-h-0"
            />
            {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
          </div>
        </Playground>
      </Section>

      <Section id="variant-glass">
        <Playground
          title="Variant: Glass"
          description="Frosted glass card over a gradient background with decorative blobs."
          code={`<Authentication
  variant="glass"
  enableLogin
  enableRegister
  enableResetPassword
  baseURL="https://api.example.com"
/>`}
        >
          <div className="w-full rounded-xl overflow-hidden" style={{ height: 520 }}>
            <Authentication
              variant="glass"
              enableLogin
              enableRegister
              enableResetPassword
              baseURL=""
              onLoginSuccess={() => setLastEvent("glass login success")}
              onError={onErr}
              className="min-h-0 h-full"
            />
          </div>
          {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
        </Playground>
      </Section>

      <Section id="variant-split">
        <Playground
          title="Variant: Split"
          description="Two-column layout — gradient branding panel on the left, form on the right. Left panel is hidden on mobile."
          code={`<Authentication
  variant="split"
  enableLogin
  enableRegister
  enableResetPassword
  baseURL="https://api.example.com"
  splitPanel={
    <div className="text-center text-white space-y-3">
      <Zap className="h-12 w-12 mx-auto" />
      <p className="text-3xl font-bold">MyApp</p>
      <p className="text-white/70">The fastest way to ship.</p>
    </div>
  }
/>`}
        >
          <div className="w-full rounded-xl overflow-hidden border border-border" style={{ height: 520 }}>
            <Authentication
              variant="split"
              enableLogin
              enableRegister
              enableResetPassword
              baseURL=""
              splitPanel={
                <div className="text-center text-white space-y-3">
                  <Zap className="h-12 w-12 mx-auto" />
                  <p className="text-3xl font-bold">MyApp</p>
                  <p className="text-white/70">The fastest way to ship.</p>
                </div>
              }
              onLoginSuccess={() => setLastEvent("split login success")}
              onError={onErr}
              className="min-h-0 h-full"
            />
          </div>
          {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
        </Playground>
      </Section>

      <Section id="variant-minimal">
        <Playground
          title="Variant: Minimal"
          description="No card border or shadow — just the form on a plain background with underline-style tabs."
          code={`<Authentication
  variant="minimal"
  enableLogin
  enableRegister
  enableResetPassword
  baseURL="https://api.example.com"
/>`}
        >
          <div className="w-full" style={{ minHeight: 420 }}>
            <Authentication
              variant="minimal"
              enableLogin
              enableRegister
              enableResetPassword
              baseURL=""
              onLoginSuccess={() => setLastEvent("minimal login success")}
              onError={onErr}
              className="min-h-0"
            />
          </div>
          {lastEvent && <p className="text-xs text-center text-muted-foreground mt-2">{lastEvent}</p>}
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "enableLogin",         type: "boolean",                                   default: "true",       description: "Show the login tab and form." },
          { prop: "enableRegister",      type: "boolean",                                   default: "true",       description: "Show the register tab and form." },
          { prop: "enableResetPassword", type: "boolean",                                   default: "true",       description: "Show the forgot password link and reset view." },
          { prop: "defaultView",         type: '"login" | "register" | "resetPassword"',    default: '"login"',    description: "Which view is shown on first render." },
          { prop: "variant",             type: '"default" | "split" | "minimal" | "glass"', default: '"default"',  description: "UI layout variant." },
          { prop: "splitPanel",          type: "ReactNode",                                                        description: "Custom content for the left panel in the split variant." },
          { prop: "baseURL",             type: "string",                                    default: '""',         description: "Axios base URL prepended to all request paths." },
          { prop: "headers",             type: "Record<string, string>",                    default: "{}",         description: "Extra HTTP headers added to every request." },
          { prop: "loginFields",         type: "AuthField[]",                                                      description: "Override the default login fields." },
          { prop: "registerFields",      type: "AuthField[]",                                                      description: "Override the default register fields." },
          { prop: "resetPasswordFields", type: "AuthField[]",                                                      description: "Override the default reset password fields." },
          { prop: "onLoginSuccess",      type: "(data: any) => void",                                              description: "Called on successful POST user/login." },
          { prop: "onRegisterSuccess",   type: "(data: any) => void",                                              description: "Called on successful POST user/store." },
          { prop: "onResetSuccess",      type: "(data: any) => void",                                              description: "Called on successful POST user/reset/password." },
          { prop: "onError",             type: "(view: AuthView, error: any) => void",                             description: "Called when any request fails." },
          { prop: "logo",                type: "ReactNode",                                                        description: "Logo rendered above the card title." },
          { prop: "title",               type: "string",                                                           description: "Override the card heading (disables auto subtitle)." },
          { prop: "className",           type: "string",                                                           description: "Additional CSS classes on the outer wrapper." },
        ]} />
      </Section>

      <Section id="authfield">
        <PropsTable rows={[
          { prop: "name",        type: "string",                                                        required: true, description: "Unique key used as the POST body field name." },
          { prop: "label",       type: "string",                                                        required: true, description: "Label shown above the field." },
          { prop: "type",        type: '"text" | "email" | "password" | "tel" | "url" | "numeric" | "integer"',    default: '"text"', description: "Input type — determines inputType and keyboard mode." },
          { prop: "placeholder", type: "string",                                                                   description: "Input placeholder. Defaults to the field label." },
          { prop: "required",    type: "boolean",                                                                   description: "Marks the field required and shows * on the label." },
          { prop: "disabled",    type: "boolean",                                                                   description: "Disables the input." },
          { prop: "error",       type: "string",                                                                    description: "Inline error message shown below the field." },
          { prop: "revealable",  type: "boolean",                                                                   description: "Show/hide toggle for password fields. Auto-enabled for password type." },
          { prop: "render",      type: "(value: string, onChange: (v: string) => void) => ReactNode",               description: "Custom renderer — replaces the default Input. Use to inject Select, OtpInput, or any other component." },
        ]} />
      </Section>

    </DocsLayout>
  )
}
