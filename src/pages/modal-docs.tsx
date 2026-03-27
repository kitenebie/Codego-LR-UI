import { useState } from "react"
import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Modal } from "../components/ui/modal"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"

const TOC = [
  { id: "standard", label: "Standard Modal" },
  { id: "unchange", label: "Unchange Modal" },
  { id: "props",    label: "Props" },
]

export function ModalDocs() {
  const [isOpen1, setIsOpen1] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)

  return (
    <DocsLayout toc={TOC}>
      <Section id="standard"><Playground
        title="Standard Modal"
        description="A simple modal dialog."
        code={`<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Are you absolutely sure?"
  description="This action cannot be undone."
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button onClick={() => setIsOpen(false)}>Continue</Button>
    </>
  }
>
  <p>Modal content goes here.</p>
</Modal>`}
      >
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsOpen1(true)}>Open Modal</Button>
          <Modal
            isOpen={isOpen1}
            onClose={() => setIsOpen1(false)}
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
            footer={
              <>
                <Button variant="outline" onClick={() => setIsOpen1(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsOpen1(false)}>Continue</Button>
              </>
            }
          >
            <div className="py-4 text-sm text-muted-foreground">
              Please confirm your action below.
            </div>
          </Modal>
        </div>
      </Playground></Section>

      <Section id="unchange"><Playground
        title="Unchange Modal"
        description="A modal that cannot be closed by clicking outside or pressing escape."
        code={`<Modal
  isOpen={isOpen}
  unchange
  title="Important Update"
  description="You must accept the new terms of service to continue."
  footer={
    <Button onClick={() => setIsOpen(false)}>I Accept</Button>
  }
>
  <p>Terms of service content...</p>
</Modal>`}
      >
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsOpen2(true)}>Open Unchange Modal</Button>
          <Modal
            isOpen={isOpen2}
            unchange
            title="Important Update"
            description="You must accept the new terms of service to continue."
            footer={
              <Button onClick={() => setIsOpen2(false)}>I Accept</Button>
            }
          >
            <div className="py-4 text-sm text-muted-foreground">
              By clicking "I Accept", you agree to our updated Terms of Service and Privacy Policy.
            </div>
          </Modal>
        </div>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "isOpen",      type: "boolean",   required: true, description: "Controls whether the modal is visible." },
        { prop: "onClose",     type: "() => void",                description: "Called when the backdrop or close button is clicked." },
        { prop: "title",       type: "ReactNode",                 description: "Modal heading." },
        { prop: "description", type: "ReactNode",                 description: "Subtitle shown below the title." },
        { prop: "children",    type: "ReactNode", required: true, description: "Main body content." },
        { prop: "footer",      type: "ReactNode",                 description: "Action buttons rendered at the bottom." },
        { prop: "unchange",    type: "boolean",   default: "false", description: "Prevent closing by clicking outside or pressing Escape." },
        { prop: "className",   type: "string",                    description: "Additional CSS classes on the modal panel." },
      ]} /></Section>
    </DocsLayout>
  )
}
