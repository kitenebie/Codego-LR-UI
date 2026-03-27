import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import {
  ModalUnchange,
  ModalConfirmation,
  ModalWithForms,
} from "../components/ui/modal-variants"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"
import { ShieldAlert } from "lucide-react"

const TOC = [
  { id: "unchange",        label: "Modal Unchange" },
  { id: "unchange-icon",   label: "Unchange with Icon" },
  { id: "confirm-danger",  label: "Confirmation Danger" },
  { id: "confirm-warning", label: "Confirmation Warning" },
  { id: "confirm-success", label: "Confirmation Success" },
  { id: "confirm-loading", label: "Confirmation Loading" },
  { id: "form-basic",      label: "Form Modal Basic" },
  { id: "form-select",     label: "Form Modal with Select" },
  { id: "form-loading",    label: "Form Modal Loading" },
  { id: "props-unchange",  label: "ModalUnchange Props" },
  { id: "props-confirm",   label: "ModalConfirmation Props" },
  { id: "props-form",      label: "ModalWithForms Props" },
  { id: "dataformat",      label: "FormField Format" },
]

export function ModalVariantsDocs() {
  const [u1, setU1] = useState(false)
  const [u2, setU2] = useState(false)
  const [cd, setCd] = useState(false)
  const [cw, setCw] = useState(false)
  const [cs, setCs] = useState(false)
  const [cl, setCl] = useState(false)
  const [loadingConfirm, setLoadingConfirm] = useState(false)
  const [fb, setFb] = useState(false)
  const [fs, setFs] = useState(false)
  const [fl, setFl] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [lastValues, setLastValues] = useState<Record<string, string> | null>(null)

  function simulateConfirm(close: () => void) {
    setLoadingConfirm(true)
    setTimeout(() => { setLoadingConfirm(false); close() }, 1500)
  }

  function simulateSubmit(values: Record<string, string>, close: () => void) {
    setFormLoading(true)
    setTimeout(() => { setFormLoading(false); setLastValues(values); close() }, 1500)
  }

  return (
    <DocsLayout toc={TOC}>

      <Section id="unchange">
        <Playground
          title="Modal Unchange"
          description="Cannot be dismissed by clicking outside or pressing Escape. Use for mandatory flows."
          code={`<ModalUnchange
  isOpen={isOpen}
  title="Terms of Service"
  description="You must accept the new terms to continue."
  footer={<Button onClick={() => setIsOpen(false)}>I Accept</Button>}
>
  <p>By clicking I Accept, you agree to our updated Terms.</p>
</ModalUnchange>`}
        >
          <div className="flex items-center gap-4">
            <Button onClick={() => setU1(true)}>Open Unchange Modal</Button>
            <ModalUnchange
              isOpen={u1}
              title="Terms of Service"
              description="You must accept the new terms to continue using the platform."
              footer={<Button onClick={() => setU1(false)}>I Accept</Button>}
            >
              <p className="text-sm text-muted-foreground">
                By clicking "I Accept", you agree to our updated Terms of Service and Privacy Policy effective immediately.
              </p>
            </ModalUnchange>
          </div>
        </Playground>
      </Section>

      <Section id="unchange-icon">
        <Playground
          title="Unchange with Icon"
          description="Pass an icon node to the icon prop for visual emphasis."
          code={`<ModalUnchange
  isOpen={isOpen}
  icon={<ShieldAlert className="h-6 w-6 text-warning" />}
  title="Security Alert"
  description="Your session has expired. Please re-authenticate."
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Logout</Button>
      <Button onClick={() => setIsOpen(false)}>Re-authenticate</Button>
    </>
  }
/>`}
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setU2(true)}>Open with Icon</Button>
            <ModalUnchange
              isOpen={u2}
              icon={<ShieldAlert className="h-6 w-6 text-warning" />}
              title="Security Alert"
              description="Your session has expired. Please re-authenticate to continue."
              footer={
                <>
                  <Button variant="outline" onClick={() => setU2(false)}>Logout</Button>
                  <Button onClick={() => setU2(false)}>Re-authenticate</Button>
                </>
              }
            />
          </div>
        </Playground>
      </Section>

      <Section id="confirm-danger">
        <Playground
          title="Confirmation - Danger"
          description="Use variant danger for destructive actions like delete."
          code={`<ModalConfirmation
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={() => setIsOpen(false)}
  variant="danger"
  title="Delete Account"
  description="This will permanently delete your account. This action cannot be undone."
  confirmLabel="Delete"
/>`}
        >
          <div className="flex items-center gap-4">
            <Button variant="destructive" onClick={() => setCd(true)}>Delete Account</Button>
            <ModalConfirmation
              isOpen={cd}
              onClose={() => setCd(false)}
              onConfirm={() => setCd(false)}
              variant="danger"
              title="Delete Account"
              description="This will permanently delete your account and all associated data. This action cannot be undone."
              confirmLabel="Delete"
            />
          </div>
        </Playground>
      </Section>

      <Section id="confirm-warning">
        <Playground
          title="Confirmation - Warning"
          description="Use variant warning for cautionary actions."
          code={`<ModalConfirmation
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={() => setIsOpen(false)}
  variant="warning"
  title="Archive Project"
  description="Archiving will hide this project from your dashboard."
  confirmLabel="Archive"
/>`}
        >
          <div className="flex items-center gap-4">
            <Button onClick={() => setCw(true)}>Archive Project</Button>
            <ModalConfirmation
              isOpen={cw}
              onClose={() => setCw(false)}
              onConfirm={() => setCw(false)}
              variant="warning"
              title="Archive Project"
              description="Archiving will hide this project from your dashboard. You can restore it later from Settings."
              confirmLabel="Archive"
            />
          </div>
        </Playground>
      </Section>

      <Section id="confirm-success">
        <Playground
          title="Confirmation - Success"
          description="Use variant success for positive confirmations like publish."
          code={`<ModalConfirmation
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={() => setIsOpen(false)}
  variant="success"
  title="Publish Changes"
  description="Your changes will be live immediately after publishing."
  confirmLabel="Publish"
/>`}
        >
          <div className="flex items-center gap-4">
            <Button onClick={() => setCs(true)}>Publish Changes</Button>
            <ModalConfirmation
              isOpen={cs}
              onClose={() => setCs(false)}
              onConfirm={() => setCs(false)}
              variant="success"
              title="Publish Changes"
              description="Your changes will be live immediately after publishing. Make sure everything looks good."
              confirmLabel="Publish"
            />
          </div>
        </Playground>
      </Section>

      <Section id="confirm-loading">
        <Playground
          title="Confirmation Loading"
          description="The loading prop disables buttons and shows a spinner on the confirm button."
          code={`<ModalConfirmation
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  variant="danger"
  title="Remove Member"
  description="This member will lose access immediately."
  confirmLabel="Remove"
  loading={loading}
/>`}
        >
          <div className="flex items-center gap-4">
            <Button variant="destructive" onClick={() => setCl(true)}>Remove Member</Button>
            <ModalConfirmation
              isOpen={cl}
              onClose={() => !loadingConfirm && setCl(false)}
              onConfirm={() => simulateConfirm(() => setCl(false))}
              variant="danger"
              title="Remove Member"
              description="This member will lose access to the workspace immediately."
              confirmLabel="Remove"
              loading={loadingConfirm}
            />
          </div>
        </Playground>
      </Section>

      <Section id="form-basic">
        <Playground
          title="Form Modal - Basic"
          description="Pass a fields array to render a dynamic form inside the modal."
          code={`<ModalWithForms
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(values) => { console.log(values); setIsOpen(false) }}
  title="Invite Team Member"
  description="Send an invitation to join your workspace."
  fields={[
    { name: "name",  label: "Full Name", type: "text",  required: true },
    { name: "email", label: "Email",     type: "email", required: true },
  ]}
  submitLabel="Send Invite"
/>`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={() => setFb(true)}>Invite Member</Button>
            <ModalWithForms
              isOpen={fb}
              onClose={() => setFb(false)}
              onSubmit={(values) => { setLastValues(values); setFb(false) }}
              title="Invite Team Member"
              description="Send an invitation to join your workspace."
              fields={[
                { name: "name",    label: "Full Name",          type: "text",     placeholder: "Jane Doe",          required: true },
                { name: "email",   label: "Email",              type: "email",    placeholder: "jane@example.com",  required: true },
                { name: "message", label: "Message (optional)", type: "textarea", placeholder: "Add a personal note..." },
              ]}
              submitLabel="Send Invite"
            />
            {lastValues && (
              <p className="text-xs text-muted-foreground">Last: {JSON.stringify(lastValues)}</p>
            )}
          </div>
        </Playground>
      </Section>

      <Section id="form-select">
        <Playground
          title="Form Modal with Select"
          description="Use type select to render a Select dropdown inside the form."
          code={`<ModalWithForms
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(values) => { console.log(values); setIsOpen(false) }}
  title="Create Project"
  fields={[
    { name: "name", label: "Project Name", type: "text", required: true },
    { name: "type", label: "Type", type: "select", options: [
      { value: "web", label: "Web App" },
      { value: "mobile", label: "Mobile App" },
    ]},
  ]}
/>`}
        >
          <div className="flex items-center gap-4">
            <Button onClick={() => setFs(true)}>Create Project</Button>
            <ModalWithForms
              isOpen={fs}
              onClose={() => setFs(false)}
              onSubmit={(values) => { setLastValues(values); setFs(false) }}
              title="Create Project"
              description="Set up a new project in your workspace."
              fields={[
                { name: "name",     label: "Project Name", type: "text",     placeholder: "My Awesome App", required: true },
                { name: "type",     label: "Project Type", type: "select",   placeholder: "Select type...",     options: [{ value: "web", label: "Web App" }, { value: "mobile", label: "Mobile App" }, { value: "api", label: "API Service" }, { value: "other", label: "Other" }] },
                { name: "priority", label: "Priority",     type: "select",   placeholder: "Select priority...", options: [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }] },
                { name: "desc",     label: "Description",  type: "textarea", placeholder: "What is this project about?" },
              ]}
              submitLabel="Create Project"
            />
          </div>
        </Playground>
      </Section>

      <Section id="form-loading">
        <Playground
          title="Form Modal Loading"
          description="The loading prop disables the form and shows a spinner on the submit button."
          code={`<ModalWithForms
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
  title="Update Profile"
  fields={[...]}
  loading={loading}
/>`}
        >
          <div className="flex items-center gap-4">
            <Button onClick={() => setFl(true)}>Update Profile</Button>
            <ModalWithForms
              isOpen={fl}
              onClose={() => !formLoading && setFl(false)}
              onSubmit={(values) => simulateSubmit(values, () => setFl(false))}
              title="Update Profile"
              description="Changes will be saved to your account."
              fields={[
                { name: "name",  label: "Display Name", type: "text",     placeholder: "Your name",        required: true },
                { name: "email", label: "Email",         type: "email",    placeholder: "you@example.com", required: true },
                { name: "bio",   label: "Bio",           type: "textarea", placeholder: "Tell us about yourself..." },
              ]}
              submitLabel="Save Changes"
              loading={formLoading}
            />
          </div>
        </Playground>
      </Section>

      <Section id="props-unchange"><PropsTable rows={[
        { prop: "isOpen",      type: "boolean",   required: true, description: "Controls visibility. Cannot be dismissed by user." },
        { prop: "title",       type: "ReactNode",                 description: "Modal heading." },
        { prop: "description", type: "ReactNode",                 description: "Subtitle below the title." },
        { prop: "icon",        type: "ReactNode",                 description: "Icon shown next to the title." },
        { prop: "footer",      type: "ReactNode",                 description: "Action buttons at the bottom." },
        { prop: "children",    type: "ReactNode",                 description: "Body content." },
        { prop: "className",   type: "string",                    description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="props-confirm"><PropsTable rows={[
        { prop: "isOpen",       type: "boolean",                                    required: true, description: "Controls visibility." },
        { prop: "onClose",      type: "() => void",                                 required: true, description: "Called when cancel or backdrop is clicked." },
        { prop: "onConfirm",    type: "() => void",                                 required: true, description: "Called when the confirm button is clicked." },
        { prop: "variant",      type: '"danger" | "warning" | "success" | "info"',  default: '"danger"', description: "Affects icon and confirm button color." },
        { prop: "title",        type: "ReactNode",                                  default: '"Are you sure?"', description: "Modal heading." },
        { prop: "description",  type: "ReactNode",                                  description: "Subtitle below the title." },
        { prop: "confirmLabel", type: "string",                                     default: '"Confirm"', description: "Label for the confirm button." },
        { prop: "cancelLabel",  type: "string",                                     default: '"Cancel"',  description: "Label for the cancel button." },
        { prop: "loading",      type: "boolean",                                    default: "false",     description: "Show spinner on confirm button and disable both buttons." },
        { prop: "className",    type: "string",                                     description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="props-form"><PropsTable rows={[
        { prop: "isOpen",       type: "boolean",                          required: true, description: "Controls visibility." },
        { prop: "onClose",      type: "() => void",                        required: true, description: "Called when cancel or backdrop is clicked." },
        { prop: "onSubmit",     type: "(values: Record<string, string>) => void", required: true, description: "Called with form values on submit." },
        { prop: "fields",       type: "FormField[]",                       required: true, description: "Array of field definitions to render." },
        { prop: "title",        type: "ReactNode",                         description: "Modal heading." },
        { prop: "description",  type: "ReactNode",                         description: "Subtitle below the title." },
        { prop: "submitLabel",  type: "string",                            default: '"Submit"',  description: "Label for the submit button." },
        { prop: "cancelLabel",  type: "string",                            default: '"Cancel"',  description: "Label for the cancel button." },
        { prop: "loading",      type: "boolean",                           default: "false",     description: "Show spinner on submit button and disable the form." },
        { prop: "className",    type: "string",                            description: "Additional CSS classes." },
      ]} /></Section>

      <Section id="dataformat"><PropsTable rows={[
        { prop: "name",        type: "string",                                              required: true, description: "Unique field key used as the form value key." },
        { prop: "label",       type: "string",                                              required: true, description: "Label shown above the field." },
        { prop: "type",        type: '"text" | "email" | "password" | "textarea" | "select"', required: true, description: "Input type to render." },
        { prop: "placeholder", type: "string",                                              description: "Placeholder text inside the field." },
        { prop: "required",    type: "boolean",                                             description: "Mark field as required (shows * and native validation)." },
        { prop: "options",     type: "{ label: string; value: string }[]",                  description: "Options list — only used when type is \"select\"." },
      ]} /></Section>
    </DocsLayout>
  )
}
