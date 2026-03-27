import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { FileUpload } from "../components/ui/file-upload"
import { PropsTable } from "../components/ui/props-table"

export function FileUploadDocs() {
  return (
    <DocsLayout toc={[
      { id: "basic",       label: "Basic Upload" },
      { id: "labelhint",   label: "Label & Hint" },
      { id: "maxsize",     label: "Max File Size" },
      { id: "multiple",    label: "Multiple Files" },
      { id: "reorderable", label: "Reorderable" },
      { id: "validation",  label: "Type Validation" },
      { id: "rejected",    label: "Rejected Types" },
      { id: "editor",      label: "Image Editor" },
      { id: "crop",        label: "Crop Ratio" },
      { id: "aspect",      label: "Panel Aspect" },
      { id: "previewheight",label: "Preview Height" },
      { id: "disabled",    label: "Disabled" },
      { id: "allprops",    label: "All Props" },
      { id: "required",    label: "Validation" },
      { id: "props",       label: "Props" },
    ]}>

      {/* ── Basic ── */}
      <Section id="basic"><Playground
        title="Basic Upload"
        description="Single file upload with drag and drop and animated dashed border."
        code={`<FileUpload
  accept="image/*"
  onFileSelect={(file) => console.log(file)}
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload accept="image/*" onFileSelect={(file) => console.log(file)} />
        </div>
      </Playground></Section>

      {/* ── Label & Hint ── */}
      <Section id="labelhint"><Playground
        title="Label & Hint"
        description="Add a label above and helper/hint text below the dropzone."
        code={`<FileUpload
  label="Profile Photo"
  hint="Recommended size: 400x400px"
  accept="image/*"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Profile Photo"
            hint="Recommended size: 400x400px"
            accept="image/*"
          />
        </div>
      </Playground></Section>

      {/* ── Max Size ── */}
      <Section id="maxsize"><Playground
        title="Max File Size"
        description="Limit file size in kilobytes. Shows an error when exceeded."
        code={`<FileUpload
  label="Small files only"
  maxSize={512}
  hint="Max 512 KB"
  accept="image/*"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Small files only"
            maxSize={512}
            hint="Max 512 KB"
            accept="image/*"
          />
        </div>
      </Playground></Section>

      {/* ── Multiple ── */}
      <Section id="multiple"><Playground
        title="Multiple Files"
        description="Allow uploading multiple files with an optional cap via maxFiles."
        code={`<FileUpload
  label="Upload Documents"
  multiple
  maxFiles={3}
  hint="Up to 3 files"
  onFilesChange={(files) => console.log(files)}
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Upload Documents"
            multiple
            maxFiles={3}
            hint="Up to 3 files"
            onFilesChange={(files) => console.log(files)}
          />
        </div>
      </Playground></Section>

      {/* ── Reorderable ── */}
      <Section id="reorderable"><Playground
        title="Reorderable Files"
        description="Drag uploaded files to reorder them when multiple is enabled."
        code={`<FileUpload
  label="Reorderable Gallery"
  multiple
  reorderable
  accept="image/*"
  onFilesChange={(files) => console.log(files)}
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Reorderable Gallery"
            multiple
            reorderable
            accept="image/*"
            onFilesChange={(files) => console.log(files)}
          />
        </div>
      </Playground></Section>

      {/* ── File Type Validation ── */}
      <Section id="validation"><Playground
        title="File Type Validation"
        description="Whitelist extensions with allowedFileTypes, blacklist with rejectedFileTypes, or restrict by MIME type."
        code={`<FileUpload
  label="Images Only"
  allowedFileTypes={[".jpg", ".jpeg", ".png", ".webp"]}
  mimeTypes={["image/*"]}
  onValidationError={(msg) => console.error(msg)}
  hint="Only .jpg, .png, .webp allowed"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Images Only"
            allowedFileTypes={[".jpg", ".jpeg", ".png", ".webp"]}
            mimeTypes={["image/*"]}
            onValidationError={(msg) => console.error(msg)}
            hint="Only .jpg, .png, .webp allowed"
          />
        </div>
      </Playground></Section>

      {/* ── Rejected Types ── */}
      <Section id="rejected"><Playground
        title="Rejected File Types"
        description="Block specific file extensions from being uploaded."
        code={`<FileUpload
  label="No Executables"
  rejectedFileTypes={[".exe", ".bat", ".sh"]}
  onValidationError={(msg) => console.error(msg)}
  hint=".exe, .bat, .sh are blocked"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="No Executables"
            rejectedFileTypes={[".exe", ".bat", ".sh"]}
            onValidationError={(msg) => console.error(msg)}
            hint=".exe, .bat, .sh are blocked"
          />
        </div>
      </Playground></Section>

      {/* ── Image Editor ── */}
      <Section id="editor"><Playground
        title="Image Editor"
        description="Enable inline image editing after upload. Supports rotate, flip, brightness, and contrast."
        code={`<FileUpload
  label="Edit After Upload"
  imageEditor
  imageEditorOptions={{
    modes: ["rotate", "flip", "brightness", "contrast"],
  }}
  accept="image/*"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Edit After Upload"
            imageEditor
            imageEditorOptions={{
              modes: ["rotate", "flip", "brightness", "contrast"],
            }}
            accept="image/*"
          />
        </div>
      </Playground></Section>

      {/* ── Image Editor with Crop Ratio ── */}
      <Section id="crop"><Playground
        title="Image Editor — Crop Ratio"
        description="Lock the crop tool to a fixed aspect ratio like 1:1 or 16:9."
        code={`<FileUpload
  label="Avatar Crop"
  imageEditor
  imageEditorOptions={{
    modes: ["crop", "rotate"],
    cropAspectRatio: "1:1",
  }}
  accept="image/*"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Avatar Crop"
            imageEditor
            imageEditorOptions={{
              modes: ["crop", "rotate"],
              cropAspectRatio: "1:1",
            }}
            accept="image/*"
          />
        </div>
      </Playground></Section>

      {/* ── Panel Aspect Ratio ── */}
      <Section id="aspect"><Playground
        title="Panel Aspect Ratio"
        description="Control the drop zone shape with panelAspectRatio."
        code={`<FileUpload
  label="Wide Dropzone"
  panelAspectRatio="16/4"
  accept="image/*"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Wide Dropzone"
            panelAspectRatio="16/4"
            accept="image/*"
          />
        </div>
      </Playground></Section>

      {/* ── Image Preview Height ── */}
      <Section id="previewheight"><Playground
        title="Image Preview Height"
        description="Control the height of the preview area in pixels."
        code={`<FileUpload
  label="Tall Preview"
  imagePreviewHeight={300}
  accept="image/*"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Tall Preview"
            imagePreviewHeight={300}
            accept="image/*"
          />
        </div>
      </Playground></Section>

      {/* ── Disabled ── */}
      <Section id="disabled"><Playground
        title="Disabled"
        description="Prevent any interaction with the upload field."
        code={`<FileUpload
  label="Disabled Upload"
  disabled
  hint="This field is read-only"
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Disabled Upload"
            disabled
            hint="This field is read-only"
          />
        </div>
      </Playground></Section>

      {/* ── All Props ── */}
      <Section id="allprops"><Playground
        title="All Props"
        description="A comprehensive example combining all available props."
        code={`<FileUpload
  label="Upload Files"
  helperText="PDF or images up to 2 MB, max 4 files"
  accept=".jpg,.jpeg,.png,.pdf"
  multiple
  maxSize={2048}
  maxFiles={4}
  reorderable
  imageEditor
  imageEditorOptions={{
    modes: ["crop", "rotate", "flip", "brightness", "contrast"],
    cropAspectRatio: "16:9",
    defaultBrightness: 100,
    defaultContrast: 100,
  }}
  allowedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
  rejectedFileTypes={[".exe", ".bat"]}
  mimeTypes={["image/*", "application/pdf"]}
  imagePreviewHeight={200}
  panelAspectRatio="16/5"
  onFilesChange={(files) => console.log(files)}
  onValidationError={(msg, file) => console.error(msg, file)}
/>`}
      >
        <div className="w-full max-w-md">
          <FileUpload
            label="Upload Files"
            helperText="PDF or images up to 2 MB, max 4 files"
            accept=".jpg,.jpeg,.png,.pdf"
            multiple
            maxSize={2048}
            maxFiles={4}
            reorderable
            imageEditor
            imageEditorOptions={{
              modes: ["crop", "rotate", "flip", "brightness", "contrast"],
              cropAspectRatio: "16:9",
              defaultBrightness: 100,
              defaultContrast: 100,
            }}
            allowedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
            rejectedFileTypes={[".exe", ".bat"]}
            mimeTypes={["image/*", "application/pdf"]}
            imagePreviewHeight={200}
            panelAspectRatio="16/5"
            onFilesChange={(files) => console.log(files)}
            onValidationError={(msg, file) => console.error(msg, file)}
          />
        </div>
      </Playground></Section>

      {/* ── Required / Validation ── */}
      <Section id="required"><Playground
        title="Validation"
        description="Use required to mark the field as required (shows * next to label). Use error to display an external validation message."
        code={`<FileUpload label="Avatar" required accept="image/*" />
<FileUpload label="Avatar" required error="Please upload a file" accept="image/*" />`}
      >
        <div className="w-full max-w-md space-y-4">
          <FileUpload label="Avatar" required accept="image/*" />
          <FileUpload label="Avatar" required error="Please upload a file" accept="image/*" />
        </div>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "onFileSelect",       type: "(file: File | null) => void",                                description: "Called when a single file is selected or removed." },
        { prop: "onFilesChange",      type: "(files: File[]) => void",                                   description: "Called whenever the file list changes." },
        { prop: "onValidationError",  type: "(message: string, file: File) => void",                     description: "Called when any validation rule fails." },
        { prop: "accept",             type: "string",                                                    description: "Native accept attribute e.g. \"image/*\"." },
        { prop: "multiple",           type: "boolean",           default: "false",                       description: "Allow uploading multiple files." },
        { prop: "maxSize",            type: "number",                                                    description: "Max file size in kilobytes." },
        { prop: "maxFiles",           type: "number",                                                    description: "Max number of files when multiple is enabled." },
        { prop: "disabled",           type: "boolean",           default: "false",                       description: "Prevent any interaction." },
        { prop: "reorderable",        type: "boolean",           default: "false",                       description: "Enable drag-and-drop reordering of uploaded files." },
        { prop: "imagePreviewHeight", type: "number",            default: "192",                         description: "Height of the preview area in pixels." },
        { prop: "panelAspectRatio",   type: "string",                                                    description: "CSS aspect-ratio for the drop zone e.g. \"16/4\"." },
        { prop: "label",              type: "string",                                                    description: "Label rendered above the dropzone." },
        { prop: "hint",               type: "string",                                                    description: "Helper text below the dropzone." },
        { prop: "helperText",         type: "string",                                                    description: "Alias for hint." },
        { prop: "imageEditor",        type: "boolean",           default: "false",                       description: "Enable inline image editing after upload." },
        { prop: "imageEditorOptions", type: "ImageEditorOptions",                                        description: "Configuration for the image editor." },
        { prop: "allowedFileTypes",   type: "string[]",                                                  description: "Whitelist of allowed file extensions e.g. [\".jpg\", \".png\"]." },
        { prop: "rejectedFileTypes",  type: "string[]",                                                  description: "Blacklist of blocked file extensions." },
        { prop: "mimeTypes",          type: "string[]",                                                  description: "Allowed MIME types e.g. [\"image/*\", \"application/pdf\"]." },
        { prop: "required",           type: "boolean",                                                   description: "Marks the field as required. Shows a * indicator next to the label." },
        { prop: "error",              type: "string",                                                    description: "External error message displayed below the dropzone." },
      ]} /></Section>

    </DocsLayout>
  )
}
