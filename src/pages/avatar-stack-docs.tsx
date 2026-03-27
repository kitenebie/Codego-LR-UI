import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { AvatarStack } from "../components/ui/avatar-stack"
import { PropsTable } from "../components/ui/props-table"

const AVATARS = Array.from({ length: 10 }, (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`)

export function AvatarStackDocs() {
  return (
    <DocsLayout toc={[
      { id: "stacked-square", label: "Stacked Square" },
      { id: "stacked-circle", label: "Stacked Circle" },
      { id: "flat-square",    label: "Flat Square" },
      { id: "flat-circle",    label: "Flat Circle" },
      { id: "limit",          label: "Limit & Overflow" },
      { id: "size",           label: "Custom Size" },
      { id: "props",          label: "Props" },
    ]}>

      <Section id="stacked-square"><Playground
        title="Stacked — Square (default)"
        description="Images overlap with a ring separator. Excess images collapse into a +N counter."
        code={`const images = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
]

<AvatarStack
  images={images}
  limit={3}
  stacked={true}
  shape="square"
/>`}
      >
        <AvatarStack images={AVATARS} limit={3} stacked shape="square" />
      </Playground></Section>

      <Section id="stacked-circle"><Playground
        title="Stacked — Circle"
        description="Same stacking behaviour with fully rounded avatars."
        code={`<AvatarStack
  images={images}
  limit={3}
  stacked={true}
  shape="circle"
/>`}
      >
        <AvatarStack images={AVATARS} limit={3} stacked shape="circle" />
      </Playground></Section>

      <Section id="flat-square"><Playground
        title="Flat — Square"
        description="Images sit side-by-side with a small gap instead of overlapping."
        code={`<AvatarStack
  images={images}
  limit={4}
  stacked={false}
  shape="square"
/>`}
      >
        <AvatarStack images={AVATARS} limit={4} stacked={false} shape="square" />
      </Playground></Section>

      <Section id="flat-circle"><Playground
        title="Flat — Circle"
        description="Flat layout with circular avatars."
        code={`<AvatarStack
  images={images}
  limit={4}
  stacked={false}
  shape="circle"
/>`}
      >
        <AvatarStack images={AVATARS} limit={4} stacked={false} shape="circle" />
      </Playground></Section>

      <Section id="limit"><Playground
        title="Custom limit & overflow label"
        description="With 10 images and limit=3, the overflow counter shows +7."
        code={`// If images has 10 items and limit is 3,
// it shows 3 avatars then a "+7" badge

<AvatarStack images={images} limit={3} stacked={true} shape="circle" />
<AvatarStack images={images} limit={5} stacked={true} shape="circle" />
<AvatarStack images={images} limit={8} stacked={true} shape="circle" />`}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-24 text-right">limit=3</span>
            <AvatarStack images={AVATARS} limit={3} stacked shape="circle" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-24 text-right">limit=5</span>
            <AvatarStack images={AVATARS} limit={5} stacked shape="circle" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-24 text-right">limit=8</span>
            <AvatarStack images={AVATARS} limit={8} stacked shape="circle" />
          </div>
        </div>
      </Playground></Section>

      <Section id="size"><Playground
        title="Custom size"
        description="Control avatar dimensions with the size prop (in px)."
        code={`// size controls the width and height in pixels

<AvatarStack images={images} limit={4} size={24} shape="circle" />
<AvatarStack images={images} limit={4} size={36} shape="circle" />
<AvatarStack images={images} limit={4} size={48} shape="circle" />`}
      >
        <div className="flex flex-col items-center gap-6">
          {[24, 36, 48].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-16 text-right">{s}px</span>
              <AvatarStack images={AVATARS} limit={4} size={s} stacked shape="circle" />
            </div>
          ))}
        </div>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "images",    type: "string[]",              required: true,  description: "Array of image URLs. Excess beyond limit collapses into a +N counter." },
        { prop: "limit",     type: "number",  default: "3",                  description: "Max avatars shown before the overflow badge." },
        { prop: "stacked",   type: "boolean", default: "true",               description: "Overlapping layout when true; side-by-side gap when false." },
        { prop: "shape",     type: '"circle" | "square"', default: '"square"', description: "Avatar border-radius style." },
        { prop: "size",      type: "number",  default: "32",                 description: "Width and height of each avatar in pixels." },
        { prop: "className", type: "string",                                 description: "Additional CSS classes on the wrapper." },
      ]} /></Section>
    </DocsLayout>
  )
}
