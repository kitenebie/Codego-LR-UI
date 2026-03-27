import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { Button } from "../components/ui/button"
import { PropsTable } from "../components/ui/props-table"
import { Mail, ArrowRight, Wallet, Heart, Star } from "lucide-react"

const TOC = [
  { id: "variants",    label: "Variants" },
  { id: "sizes",       label: "Sizes" },
  { id: "rounded",     label: "Rounded" },
  { id: "fullwidth",   label: "Full Width" },
  { id: "colors",      label: "Custom Colors" },
  { id: "typography",  label: "Typography" },
  { id: "shadows",     label: "Shadows" },
  { id: "loading",     label: "Loading State" },
  { id: "icons",       label: "Icons" },
  { id: "states",      label: "States" },
  { id: "animations",  label: "Animations" },
  { id: "aslink",      label: "As Link" },
  { id: "confirm",     label: "Confirm Click" },
  { id: "dimensions",  label: "Dimensions" },
  { id: "opacity",     label: "Opacity" },
  { id: "spacing",     label: "Spacing" },
  { id: "events",      label: "Events" },
  { id: "a11y",        label: "Accessibility" },
  { id: "behavior",    label: "Behavior" },
  { id: "navigation",  label: "Navigation" },
  { id: "gradient",    label: "Gradient" },
  { id: "allprops",    label: "All Props" },
  { id: "props",       label: "Props" },
]

export function ButtonDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="variants"><Playground
        title="Button Variants"
        description="Different button styles for various actions."
        code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>`}
      >
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
        </div>
      </Playground></Section>

      <Section id="sizes"><Playground
        title="Button Sizes"
        description="Buttons come in different sizes."
        code={`<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`}
      >
        <div className="flex items-center gap-4">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </Playground></Section>

      <Section id="rounded"><Playground
        title="Rounded Variants"
        description="Different border radius options."
        code={`<Button rounded="none">None</Button>
<Button rounded="sm">Small</Button>
<Button rounded="md">Medium</Button>
<Button rounded="lg">Large</Button>
<Button rounded="xl">Extra Large</Button>
<Button rounded="full">Full</Button>`}
      >
        <div className="flex flex-wrap gap-4">
          <Button rounded="none">None</Button>
          <Button rounded="sm">Small</Button>
          <Button rounded="md">Medium</Button>
          <Button rounded="lg">Large</Button>
          <Button rounded="xl">Extra Large</Button>
          <Button rounded="full">Full</Button>
        </div>
      </Playground></Section>

      <Section id="fullwidth"><Playground
        title="Full Width"
        description="Button that spans the full width."
        code={`<Button fullWidth>Full Width Button</Button>`}
      >
        <Button fullWidth>Full Width Button</Button>
      </Playground></Section>

      <Section id="colors"><Playground
        title="Custom Colors"
        description="Buttons with custom background and text colors."
        code={`<Button bgColor="#ff6b6b" textColor="white">Custom BG</Button>
<Button textColor="#3b82f6" borderColor="#3b82f6">Custom Text</Button>`}
      >
        <div className="flex gap-4">
          <Button bgColor="#ff6b6b" textColor="white">Custom BG</Button>
          <Button textColor="#3b82f6" borderColor="#3b82f6">Custom Text</Button>
        </div>
      </Playground></Section>

      <Section id="typography"><Playground
        title="Typography"
        description="Different font weights and sizes."
        code={`<Button fontWeight="normal">Normal</Button>
<Button fontWeight="bold">Bold</Button>
<Button fontSize={18}>Large Font</Button>`}
      >
        <div className="flex gap-4">
          <Button fontWeight="normal">Normal</Button>
          <Button fontWeight="bold">Bold</Button>
          <Button fontSize={18}>Large Font</Button>
        </div>
      </Playground></Section>

      <Section id="shadows"><Playground
        title="Shadows"
        description="Buttons with shadow effects."
        code={`<Button shadow>Shadow</Button>
<Button shadow shadowColor="rgba(0,0,0,0.5)">Custom Shadow</Button>`}
      >
        <div className="flex gap-4">
          <Button shadow>Shadow</Button>
          <Button shadow shadowColor="rgba(0,0,0,0.5)">Custom Shadow</Button>
        </div>
      </Playground></Section>

      <Section id="loading"><Playground
        title="Loading State"
        description="Buttons in loading state."
        code={`<Button loading>Loading Left</Button>
<Button loading loadingPosition="right">Loading Right</Button>
<Button loading loadingText="Saving...">Custom Loading</Button>`}
      >
        <div className="flex gap-4">
          <Button loading>Loading Left</Button>
          <Button loading loadingPosition="right">Loading Right</Button>
          <Button loading loadingText="Saving...">Custom Loading</Button>
        </div>
      </Playground></Section>

      <Section id="icons"><Playground
        title="Icons (leftIcon / rightIcon)"
        description="Buttons with icons using leftIcon and rightIcon props."
        code={`<Button leftIcon={<Mail />}>Email</Button>
<Button rightIcon={<ArrowRight />}>Next</Button>
<Button leftIcon={<Heart />} rightIcon={<Star />}>Both Icons</Button>`}
      >
        <div className="flex gap-4">
          <Button leftIcon={<Mail />}>Email</Button>
          <Button rightIcon={<ArrowRight />}>Next</Button>
          <Button leftIcon={<Heart />} rightIcon={<Star />}>Both Icons</Button>
        </div>
      </Playground></Section>

      <Section id="states"><Playground
        title="States"
        description="Disabled, active, and selected states."
        code={`<Button disabled>Disabled</Button>
<Button active>Active</Button>
<Button selected>Selected</Button>`}
      >
        <div className="flex gap-4">
          <Button disabled>Disabled</Button>
          <Button active>Active</Button>
          <Button selected>Selected</Button>
        </div>
      </Playground></Section>

      <Section id="animations"><Playground
        title="Animations"
        description="Hover scale and other animations."
        code={`<Button hoverScale={1.05}>Hover Scale</Button>
<Button transitionDuration={500}>Slow Transition</Button>`}
      >
        <div className="flex gap-4">
          <Button hoverScale={1.05}>Hover Scale</Button>
          <Button transitionDuration={500}>Slow Transition</Button>
        </div>
      </Playground></Section>

      <Section id="aslink"><Playground
        title="As Link"
        description="Button rendered as anchor tag."
        code={`<Button as="a" href="https://example.com" target="_blank">As Link</Button>`}
      >
        <Button as="a" href="https://example.com" target="_blank">As Link</Button>
      </Playground></Section>

      <Section id="confirm"><Playground
        title="Confirm Before Click"
        description="Button that shows a modal confirmation before firing onClick. Customize the title, content, and footer actions."
        code={`// Default cancel / proceed buttons
<Button
  confirmBeforeClick
  confirmBeforeClickModalTitle="Delete this item?"
  confirmBeforeClickModalContent="This action cannot be undone."
  onClick={() => alert('Deleted!')}
  variant="danger"
>
  Delete
</Button>

// Custom footer action
<Button
  confirmBeforeClick
  confirmBeforeClickModalTitle="Publish changes?"
  confirmBeforeClickModalContent="Your changes will go live immediately."
  confirmBeforeClickFooterAction={
    <>
      <Button variant="outline" onClick={...}>Cancel</Button>
      <Button variant="success" onClick={...}>Yes, publish</Button>
    </>
  }
  onClick={() => alert('Published!')}
>
  Publish
</Button>`}
      >
        <div className="flex flex-wrap gap-4">
          <Button
            confirmBeforeClick
            confirmBeforeClickModalTitle="Delete this item?"
            confirmBeforeClickModalContent="This action is permanent and cannot be undone. All associated data will be removed."
            onClick={() => alert('Deleted!')}
            variant="danger"
          >
            Delete Item
          </Button>
          <Button
            confirmBeforeClick
            confirmBeforeClickModalTitle="Publish changes?"
            confirmBeforeClickModalContent="Your changes will be visible to all users immediately after publishing."
            onClick={() => alert('Published!')}
          >
            Publish
          </Button>
          <Button
            variant="outline"
            confirmBeforeClick
            confirmBeforeClickModalTitle="Leave without saving?"
            confirmBeforeClickModalContent="Any unsaved changes will be lost."
            confirmBeforeClickFooterAction={
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => {}}>Stay</Button>
                <Button size="sm" variant="danger" onClick={() => alert('Left!')}>Leave anyway</Button>
              </div>
            }
          >
            Leave Page
          </Button>
        </div>
      </Playground></Section>

      <Section id="dimensions"><Playground
        title="Dimensions"
        description="Custom width and height."
        code={`<Button width={200} height={60}>Custom Size</Button>
<Button width="150px">String Width</Button>`}
      >
        <div className="flex gap-4">
          <Button width={200} height={60}>Custom Size</Button>
          <Button width="150px">String Width</Button>
        </div>
      </Playground></Section>

      <Section id="opacity"><Playground
        title="Opacity"
        description="Button with custom opacity."
        code={`<Button opacity={0.7}>70% Opacity</Button>
<Button opacity={0.3}>30% Opacity</Button>`}
      >
        <div className="flex gap-4">
          <Button opacity={0.7}>70% Opacity</Button>
          <Button opacity={0.3}>30% Opacity</Button>
        </div>
      </Playground></Section>

      <Section id="spacing"><Playground
        title="Spacing"
        description="Custom padding and margin."
        code={`<Button padding={20}>Extra Padding</Button>
<Button margin={10}>With Margin</Button>`}
      >
        <div className="flex gap-4">
          <Button padding={20}>Extra Padding</Button>
          <Button margin={10}>With Margin</Button>
        </div>
      </Playground></Section>

      <Section id="events"><Playground
        title="Events"
        description="Button with event handlers."
        code={`<Button onClick={() => console.log('Clicked!')}>Click Me</Button>
<Button onMouseEnter={() => console.log('Hovered!')}>Hover Me</Button>`}
      >
        <div className="flex gap-4">
          <Button onClick={() => console.log('Clicked!')}>Click Me</Button>
          <Button onMouseEnter={() => console.log('Hovered!')}>Hover Me</Button>
        </div>
      </Playground></Section>

      <Section id="a11y"><Playground
        title="Accessibility"
        description="Buttons with accessibility attributes."
        code={`<Button ariaLabel="Submit form">Submit</Button>
<Button role="button" tabIndex={0}>Accessible Button</Button>`}
      >
        <div className="flex gap-4">
          <Button ariaLabel="Submit form">Submit</Button>
          <Button role="button" tabIndex={0}>Accessible Button</Button>
        </div>
      </Playground></Section>

      <Section id="behavior"><Playground
        title="Behavior"
        description="Buttons with behavioral props."
        code={`<Button preventDefault onClick={(e) => console.log('Prevented default')}>Prevent Default</Button>
<Button stopPropagation onClick={(e) => console.log('Stopped propagation')}>Stop Propagation</Button>`}
      >
        <div className="flex gap-4">
          <Button preventDefault onClick={(e) => console.log('Prevented default')}>Prevent Default</Button>
          <Button stopPropagation onClick={(e) => console.log('Stopped propagation')}>Stop Propagation</Button>
        </div>
      </Playground></Section>

      <Section id="navigation"><Playground
        title="Navigation"
        description="Button as link."
        code={`<Button href="https://google.com" target="_blank">Google</Button>
<Button as="a" href="https://github.com">GitHub</Button>`}
      >
        <div className="flex gap-4">
          <Button href="https://google.com" target="_blank">Google</Button>
          <Button as="a" href="https://github.com">GitHub</Button>
        </div>
      </Playground></Section>

      <Section id="advanced"><Playground
        title="Advanced"
        description="Advanced props like custom styles and test ID."
        code={`<Button style={{ backgroundColor: 'purple', color: 'white' }}>Custom Style</Button>
<Button testID="my-button">With Test ID</Button>`}
      >
        <div className="flex gap-4">
          <Button style={{ backgroundColor: 'purple', color: 'white' }}>Custom Style</Button>
          <Button testID="my-button">With Test ID</Button>
        </div>
      </Playground></Section>

      <Section id="classname"><Playground
        title="Custom ClassName"
        description="Buttons with custom className for additional styling."
        code={`<Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Gradient</Button>
<Button className="border-2 border-dashed border-blue-500 text-blue-500">Dashed Border</Button>
<Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">Sunset</Button>`}
      >
        <div className="flex gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Gradient</Button>
          <Button className="border-2 border-dashed border-blue-500 text-blue-500">Dashed Border</Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">Sunset</Button>
        </div>
      </Playground></Section>

      <Section id="gradient"><Playground
        title="Gradient"
        description="Buttons with gradient backgrounds using gradientFrom, gradientTo, and gradientDirection props."
        code={`<Button gradientFrom="#8b5cf6" gradientTo="#ec4899" textColor="white">Purple to Pink</Button>
<Button gradientFrom="#3b82f6" gradientTo="#10b981" textColor="white" gradientDirection="to-r">Blue to Green</Button>
<Button gradientFrom="primary" gradientTo="info" textColor="white" gradientDirection="to-br">Orange to Red</Button>
<Button gradientFrom="info" gradientTo="#ef4444" textColor="white" gradientDirection="to-br">Orange to Red</Button>`}
      >
        <div className="flex gap-4">
          <Button gradientFrom="#8b5cf6" gradientTo="#ec4899" textColor="white">Purple to Pink</Button>
          <Button gradientFrom="#3b82f6" gradientTo="#10b981" textColor="white" gradientDirection="to-r">Blue to Green</Button>
          <Button gradientFrom="primary" gradientTo="info" textColor="white" gradientDirection="to-br">Orange to Red</Button>
          <Button gradientFrom="info" gradientTo="#ef4444" textColor="white" gradientDirection="to-br">Orange to Red</Button>
        </div>
      </Playground></Section>

      <Section id="allprops"><Playground
        title="All Props in Action"
        description="A comprehensive example showcasing multiple props working together."
        code={`<Button
  variant="success"
  size="lg"
  rounded="lg"
  bgColor="#10b981"
  textColor="white"
  shadow
  fontWeight="bold"
  leftIcon={<Heart />}
  rightIcon={<Star />}
  hoverScale={1.05}
  transitionDuration={300}
  onClick={() => alert('Clicked!')}
  ariaLabel="Custom button"
  className="custom-button"
>
  Comprehensive Example
</Button>`}
      >
        <Button
          variant="success"
          size="lg"
          rounded="lg"
          bgColor="#10b981"
          textColor="white"
          shadow
          fontWeight="bold"
          leftIcon={<Heart />}
          rightIcon={<Star />}
          hoverScale={1.05}
          transitionDuration={300}
          onClick={() => alert('Clicked!')}
          ariaLabel="Custom button"
          className="custom-button"
        >
          Comprehensive Example
        </Button>
      </Playground></Section>

      <Section id="allbuttonprops"><Playground
        title="All Button Props"
        description="A comprehensive example showcasing all available props working together."
        code={`<Button
  variant="success"
  size="lg"
  fullWidth={false}
  width={300}
  height={60}
  rounded="lg"
  bgColor="#10b981"
  textColor="white"
  borderColor="#059669"
  borderWidth={2}
  shadow
  shadowColor="rgba(16, 185, 129, 0.4)"
  opacity={1}
  fontSize={16}
  fontWeight="bold"
  padding={16}
  margin={8}
  label="All Props Button"
  leftIcon={<Heart />}
  rightIcon={<Star />}
  iconOnly={false}
  loading={false}
  loadingText="Processing..."
  loadingPosition="left"
  disabled={false}
  active={false}
  selected={false}
  animate={true}
  transitionDuration={300}
  transitionType="ease"
  hoverScale={1.05}
  hoverOpacity={0.9}
  hoverBgColor="#059669"
  hoverTextColor="white"
  hoverBorderColor="#047857"
  activeScale={0.95}
  pressAnimation="shrink"
  rippleEffect={true}
  rippleColor="rgba(255,255,255,0.3)"
  rippleDuration={600}
  animationType="pulse"
  loopAnimation={false}
  animationDelay={0}
  fadeIn={true}
  slideIn={true}
  slideDirection="bottom"
  onClick={() => alert('Clicked!')}
  onDoubleClick={() => alert('Double clicked!')}
  onMouseEnter={() => console.log('Mouse entered')}
  onMouseLeave={() => console.log('Mouse left')}
  onMouseDown={() => console.log('Mouse down')}
  onMouseUp={() => console.log('Mouse up')}
  onPress={() => console.log('Pressed')}
  onLongPress={() => console.log('Long pressed')}
  onPressIn={() => console.log('Press in')}
  onPressOut={() => console.log('Press out')}
  onFocus={() => console.log('Focused')}
  onBlur={() => console.log('Blurred')}
  ariaLabel="All props demonstration button"
  role="button"
  tabIndex={0}
  type="button"
  preventDefault={false}
  stopPropagation={false}
  debounceTime={0}
  throttleTime={0}
  confirmBeforeClick={false}
  confirmBeforeClickModalTitle="Are you sure?"
  confirmBeforeClickModalContent="This action cannot be undone."
  href="https://example.com"
  target="_blank"
  as="button"
  className="all-props-button"
  style={{ boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}
  testID="all-props-button"
>
  All Props Button
</Button>`}
      >
        <Button
          variant="success"
          size="lg"
          fullWidth={false}
          width={300}
          height={60}
          rounded="lg"
          bgColor="#10b981"
          textColor="white"
          borderColor="#059669"
          borderWidth={2}
          shadow
          shadowColor="rgba(16, 185, 129, 0.4)"
          opacity={1}
          fontSize={16}
          fontWeight="bold"
          padding={16}
          margin={8}
          label="All Props Button"
          leftIcon={<Heart />}
          rightIcon={<Star />}
          iconOnly={false}
          loading={false}
          loadingText="Processing..."
          loadingPosition="left"
          disabled={false}
          active={false}
          selected={false}
          animate={true}
          transitionDuration={300}
          transitionType="ease"
          hoverScale={1.05}
          hoverOpacity={0.9}
          hoverBgColor="#059669"
          hoverTextColor="white"
          hoverBorderColor="#047857"
          activeScale={0.95}
          pressAnimation="shrink"
          rippleEffect={true}
          rippleColor="rgba(255,255,255,0.3)"
          rippleDuration={600}
          animationType="pulse"
          loopAnimation={false}
          animationDelay={0}
          fadeIn={true}
          slideIn={true}
          slideDirection="bottom"
          onClick={() => alert('Clicked!')}
          onDoubleClick={() => alert('Double clicked!')}
          onMouseEnter={() => alert('Mouse entered')}
          onMouseLeave={() => alert('Mouse left')}
          onMouseDown={() => alert('Mouse down')}
          onMouseUp={() => alert('Mouse up')}
          onPress={() => alert('Pressed')}
          onLongPress={() => alert('Long pressed')}
          onPressIn={() => alert('Press in')}
          onPressOut={() => alert('Press out')}
          onFocus={() => alert('Focused')}
          onBlur={() => alert('Blurred')}
          ariaLabel="All props demonstration button"
          role="button"
          tabIndex={0}
          type="button"
          preventDefault={false}
          stopPropagation={false}
          debounceTime={0}
          throttleTime={0}
          confirmBeforeClick={false}
          confirmBeforeClickModalTitle="Are you sure?"
          confirmBeforeClickModalContent="This action cannot be undone."
          href="https://example.com"
          target="_blank"
          as="button"
          className="all-props-button"
          style={{ boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}
          testID="all-props-button"
        >
          All Props Button
        </Button>
      </Playground></Section>

      <Section id="props"><PropsTable rows={[
        { prop: "variant",          type: '"primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success"', default: '"primary"', description: "Visual style of the button." },
        { prop: "size",             type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"',    description: "Height and padding preset." },
        { prop: "rounded",          type: '"none" | "sm" | "md" | "lg" | "xl" | "full"', default: '"md"', description: "Border radius." },
        { prop: "fullWidth",        type: "boolean",                          default: "false",   description: "Stretch to fill the container." },
        { prop: "loading",          type: "boolean",                          default: "false",   description: "Show spinner and disable interaction." },
        { prop: "loadingText",      type: "string",                                               description: "Text shown while loading." },
        { prop: "loadingPosition",  type: '"left" | "right" | "center"',      default: '"left"',  description: "Spinner position relative to text." },
        { prop: "leftIcon",         type: "ReactNode",                                            description: "Icon rendered before the label." },
        { prop: "rightIcon",        type: "ReactNode",                                            description: "Icon rendered after the label." },
        { prop: "disabled",         type: "boolean",                          default: "false",   description: "Disable the button." },
        { prop: "bgColor",          type: "string",                                               description: "Custom background color (CSS value)." },
        { prop: "textColor",        type: "string",                                               description: "Custom text color (CSS value)." },
        { prop: "gradientFrom",     type: "string",                                               description: "Gradient start color." },
        { prop: "gradientTo",       type: "string",                                               description: "Gradient end color." },
        { prop: "shadow",           type: "boolean",                          default: "false",   description: "Apply a drop shadow." },
        { prop: "hoverScale",       type: "number",                                               description: "Scale transform on hover (e.g. 1.05)." },
        { prop: "confirmBeforeClick",             type: "boolean",    default: "false",   description: "Show a modal confirmation before firing onClick." },
        { prop: "confirmBeforeClickModalTitle",    type: "string",                         description: "Heading text inside the confirmation modal." },
        { prop: "confirmBeforeClickModalContent",  type: "ReactNode",                      description: "Body content inside the confirmation modal." },
        { prop: "confirmBeforeClickFooterAction",  type: "ReactNode",                      description: "Custom footer buttons. Defaults to Cancel / Proceed if omitted." },
        { prop: "href",             type: "string",                                               description: "Render as an anchor tag with this href." },
        { prop: "as",               type: '"button" | "a" | "div"',           default: '"button"', description: "Underlying HTML element." },
        { prop: "onClick",          type: "(e?: MouseEvent) => void",                             description: "Click handler." },
        { prop: "className",        type: "string",                                               description: "Additional CSS classes." },
      ]} /></Section>
    </DocsLayout>
  )
}
