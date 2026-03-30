import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  CardFlat, CardElevated, CardOutlined, CardGhost,
  CardGlass, CardGradientPrimary, CardGradientDark, CardGradientSunset, CardGradientOcean, CardGradientForest,
  CardGlowPrimary, CardGlowSuccess, CardGlowDanger, CardGlowWarning, CardGlowInfo,
  CardTintedPrimary, CardTintedSuccess, CardTintedDanger, CardTintedWarning, CardTintedInfo,
  CardBorderTopPrimary, CardBorderTopSuccess, CardBorderTopDanger, CardBorderTopWarning,
  CardBorderLeftPrimary, CardBorderLeftSuccess, CardBorderLeftDanger, CardBorderLeftWarning,
  CardInteractive, CardInteractiveGlow,
  CardCompact, CardWide, CardRounded, CardSharp, CardDashed, CardDashedPrimary,
  CardNoise, CardMesh, CardDark, CardLight, CardFrostedDark, CardFrostedLight,
  CardStripeAccent, CardStripeBottom,
  CardImageHeader, CardAvatar, CardStatMini, CardPricing, CardNotification, CardSkeleton,
} from "../components/ui/card"
import { PropsTable } from "../components/ui/props-table"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

const TOC = [
  { id: "base",        label: "Base Card" },
  { id: "surface",     label: "Surface Variants" },
  { id: "gradient",    label: "Gradient Variants" },
  { id: "glow",        label: "Glow Variants" },
  { id: "tinted",      label: "Tinted Variants" },
  { id: "bordered",    label: "Bordered Accent" },
  { id: "interactive", label: "Interactive" },
  { id: "shape",       label: "Shape & Size" },
  { id: "texture",     label: "Texture & Frosted" },
  { id: "stripe",      label: "Stripe Accent" },
  { id: "composed",    label: "Composed Variants" },
  { id: "props",       label: "Props" },
]

// ─── Shared demo content ──────────────────────────────────────────────────────
function DemoBody({ title = "Card Title", desc = "A short description goes here." }: { title?: string; desc?: string }) {
  return (
    <>
      <div className="p-5 pb-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs opacity-70 mt-1">{desc}</p>
      </div>
      <div className="p-5 pt-3">
        <p className="text-xs opacity-60">Main content area with supporting text and details.</p>
      </div>
    </>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">{children}</div>
}

export function CardDocs() {
  return (
    <DocsLayout toc={TOC}>

      {/* ── Base ── */}
      <Section id="base">
        <Playground
          title="Base Card"
          description="The default composable card with header, content, and footer sub-components."
          code={`<Card className="w-[340px]">
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy your new project in one-click.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      Main content area for forms, text, or other components.
    </p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </CardFooter>
</Card>`}
        >
          <Card className="w-[340px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Main content area for forms, text, or other components.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>
        </Playground>
      </Section>

      {/* ── Surface ── */}
      <Section id="surface">
        <Playground
          title="Surface Variants"
          description="Flat, Elevated, Outlined, Ghost, and Glass surface styles."
          code={`<CardFlat>...</CardFlat>
<CardElevated>...</CardElevated>
<CardOutlined>...</CardOutlined>
<CardGhost>...</CardGhost>
<CardGlass>...</CardGlass>`}
        >
          <Grid>
            <CardFlat><DemoBody title="Flat" desc="No shadow, clean border." /></CardFlat>
            <CardElevated><DemoBody title="Elevated" desc="Deep shadow lift." /></CardElevated>
            <CardOutlined><DemoBody title="Outlined" desc="2px border, transparent bg." /></CardOutlined>
            <CardGhost><DemoBody title="Ghost" desc="Transparent, hover accent." /></CardGhost>
            <CardGlass><DemoBody title="Glass" desc="Frosted glass effect." /></CardGlass>
          </Grid>
        </Playground>
      </Section>

      {/* ── Gradient ── */}
      <Section id="gradient">
        <Playground
          title="Gradient Variants"
          description="Five gradient presets — Primary, Dark, Sunset, Ocean, Forest."
          code={`<CardGradientPrimary>...</CardGradientPrimary>
<CardGradientDark>...</CardGradientDark>
<CardGradientSunset>...</CardGradientSunset>
<CardGradientOcean>...</CardGradientOcean>
<CardGradientForest>...</CardGradientForest>`}
        >
          <Grid>
            <CardGradientPrimary><DemoBody title="Primary" desc="Indigo → Blue gradient." /></CardGradientPrimary>
            <CardGradientDark><DemoBody title="Dark" desc="Neutral 900 → 700." /></CardGradientDark>
            <CardGradientSunset><DemoBody title="Sunset" desc="Orange → Pink." /></CardGradientSunset>
            <CardGradientOcean><DemoBody title="Ocean" desc="Cyan → Blue." /></CardGradientOcean>
            <CardGradientForest><DemoBody title="Forest" desc="Emerald → Teal." /></CardGradientForest>
          </Grid>
        </Playground>
      </Section>

      {/* ── Glow ── */}
      <Section id="glow">
        <Playground
          title="Glow Variants"
          description="Colored outer glow matching semantic color tokens."
          code={`<CardGlowPrimary>...</CardGlowPrimary>
<CardGlowSuccess>...</CardGlowSuccess>
<CardGlowDanger>...</CardGlowDanger>
<CardGlowWarning>...</CardGlowWarning>
<CardGlowInfo>...</CardGlowInfo>`}
        >
          <Grid>
            <CardGlowPrimary><DemoBody title="Glow Primary" desc="Primary color glow." /></CardGlowPrimary>
            <CardGlowSuccess><DemoBody title="Glow Success" desc="Green glow." /></CardGlowSuccess>
            <CardGlowDanger><DemoBody title="Glow Danger" desc="Red glow." /></CardGlowDanger>
            <CardGlowWarning><DemoBody title="Glow Warning" desc="Amber glow." /></CardGlowWarning>
            <CardGlowInfo><DemoBody title="Glow Info" desc="Blue glow." /></CardGlowInfo>
          </Grid>
        </Playground>
      </Section>

      {/* ── Tinted ── */}
      <Section id="tinted">
        <Playground
          title="Tinted Variants"
          description="Subtle tinted backgrounds with matching border — great for status cards."
          code={`<CardTintedPrimary>...</CardTintedPrimary>
<CardTintedSuccess>...</CardTintedSuccess>
<CardTintedDanger>...</CardTintedDanger>
<CardTintedWarning>...</CardTintedWarning>
<CardTintedInfo>...</CardTintedInfo>`}
        >
          <Grid>
            <CardTintedPrimary><DemoBody title="Tinted Primary" desc="10% primary fill." /></CardTintedPrimary>
            <CardTintedSuccess><DemoBody title="Tinted Success" desc="10% success fill." /></CardTintedSuccess>
            <CardTintedDanger><DemoBody title="Tinted Danger" desc="10% danger fill." /></CardTintedDanger>
            <CardTintedWarning><DemoBody title="Tinted Warning" desc="10% warning fill." /></CardTintedWarning>
            <CardTintedInfo><DemoBody title="Tinted Info" desc="10% info fill." /></CardTintedInfo>
          </Grid>
        </Playground>
      </Section>

      {/* ── Bordered ── */}
      <Section id="bordered">
        <Playground
          title="Bordered Accent"
          description="Top and left accent borders in semantic colors — ideal for dashboards and alerts."
          code={`<CardBorderTopPrimary>...</CardBorderTopPrimary>
<CardBorderTopSuccess>...</CardBorderTopSuccess>
<CardBorderTopDanger>...</CardBorderTopDanger>
<CardBorderTopWarning>...</CardBorderTopWarning>
<CardBorderLeftPrimary>...</CardBorderLeftPrimary>
<CardBorderLeftSuccess>...</CardBorderLeftSuccess>
<CardBorderLeftDanger>...</CardBorderLeftDanger>
<CardBorderLeftWarning>...</CardBorderLeftWarning>`}
        >
          <Grid>
            <CardBorderTopPrimary><DemoBody title="Top Primary" desc="4px top border." /></CardBorderTopPrimary>
            <CardBorderTopSuccess><DemoBody title="Top Success" desc="4px top border." /></CardBorderTopSuccess>
            <CardBorderTopDanger><DemoBody title="Top Danger" desc="4px top border." /></CardBorderTopDanger>
            <CardBorderTopWarning><DemoBody title="Top Warning" desc="4px top border." /></CardBorderTopWarning>
            <CardBorderLeftPrimary><DemoBody title="Left Primary" desc="4px left border." /></CardBorderLeftPrimary>
            <CardBorderLeftSuccess><DemoBody title="Left Success" desc="4px left border." /></CardBorderLeftSuccess>
            <CardBorderLeftDanger><DemoBody title="Left Danger" desc="4px left border." /></CardBorderLeftDanger>
            <CardBorderLeftWarning><DemoBody title="Left Warning" desc="4px left border." /></CardBorderLeftWarning>
          </Grid>
        </Playground>
      </Section>

      {/* ── Interactive ── */}
      <Section id="interactive">
        <Playground
          title="Interactive Variants"
          description="Hover-lift and hover-glow effects for clickable cards."
          code={`<CardInteractive onClick={...}>...</CardInteractive>
<CardInteractiveGlow onClick={...}>...</CardInteractiveGlow>`}
        >
          <Grid>
            <CardInteractive><DemoBody title="Hover Lift" desc="Translates up on hover." /></CardInteractive>
            <CardInteractiveGlow><DemoBody title="Hover Glow" desc="Primary glow on hover." /></CardInteractiveGlow>
          </Grid>
        </Playground>
      </Section>

      {/* ── Shape & Size ── */}
      <Section id="shape">
        <Playground
          title="Shape & Size Variants"
          description="Compact, Wide, Rounded, Sharp, Dashed, and Dashed Primary."
          code={`<CardCompact>...</CardCompact>
<CardWide>...</CardWide>
<CardRounded>...</CardRounded>
<CardSharp>...</CardSharp>
<CardDashed>...</CardDashed>
<CardDashedPrimary>...</CardDashedPrimary>`}
        >
          <Grid>
            <CardCompact><DemoBody title="Compact" desc="Tight padding, rounded-lg." /></CardCompact>
            <CardWide><DemoBody title="Wide" desc="Full width, rounded-2xl." /></CardWide>
            <CardRounded><DemoBody title="Rounded" desc="rounded-3xl corners." /></CardRounded>
            <CardSharp><DemoBody title="Sharp" desc="No border radius." /></CardSharp>
            <CardDashed><DemoBody title="Dashed" desc="Dashed border style." /></CardDashed>
            <CardDashedPrimary><DemoBody title="Dashed Primary" desc="Dashed + primary tint." /></CardDashedPrimary>
          </Grid>
        </Playground>
      </Section>

      {/* ── Texture & Frosted ── */}
      <Section id="texture">
        <Playground
          title="Texture & Frosted"
          description="Noise texture, mesh gradient, dark/light solid, and frosted glass variants."
          code={`<CardNoise>...</CardNoise>
<CardMesh>...</CardMesh>
<CardDark>...</CardDark>
<CardLight>...</CardLight>
<CardFrostedDark>...</CardFrostedDark>
<CardFrostedLight>...</CardFrostedLight>`}
        >
          <Grid>
            <CardNoise><DemoBody title="Noise" desc="Subtle noise texture overlay." /></CardNoise>
            <CardMesh><DemoBody title="Mesh Gradient" desc="Radial mesh gradient." /></CardMesh>
            <CardDark><DemoBody title="Dark Solid" desc="Neutral-900 background." /></CardDark>
            <CardLight><DemoBody title="Light Solid" desc="Pure white background." /></CardLight>
            <CardFrostedDark><DemoBody title="Frosted Dark" desc="Black/50 + backdrop blur." /></CardFrostedDark>
            <CardFrostedLight><DemoBody title="Frosted Light" desc="White/70 + backdrop blur." /></CardFrostedLight>
          </Grid>
        </Playground>
      </Section>

      {/* ── Stripe ── */}
      <Section id="stripe">
        <Playground
          title="Stripe Accent"
          description="Gradient stripe at the top or bottom of the card."
          code={`<CardStripeAccent>...</CardStripeAccent>
<CardStripeBottom>...</CardStripeBottom>`}
        >
          <Grid>
            <CardStripeAccent><DemoBody title="Stripe Top" desc="Gradient stripe at top." /></CardStripeAccent>
            <CardStripeBottom><DemoBody title="Stripe Bottom" desc="Gradient stripe at bottom." /></CardStripeBottom>
          </Grid>
        </Playground>
      </Section>

      {/* ── Composed ── */}
      <Section id="composed">
        <Playground
          title="Composed Variants"
          description="Pre-composed cards for common UI patterns: image header, avatar, stat, pricing, notification, and skeleton."
          code={`<CardImageHeader imageSrc="..." imageHeight="h-36">
  <div className="p-4">...</div>
</CardImageHeader>

<CardAvatar name="Kenneth Gimpao" role="Frontend Engineer" />

<CardStatMini label="Total Revenue" value="$48,295" trend="up" trendValue="12.4% this month" />

<CardPricing
  plan="Pro"
  price="$29"
  highlighted
  features={["Unlimited projects", "Priority support", "Custom domain"]}
  action={<Button fullWidth>Get Started</Button>}
/>

<CardNotification
  variant="success"
  title="Deployment successful"
  message="Your project is live at codego.dev"
  onDismiss={() => {}}
/>

<CardSkeleton />`}
        >
          <Grid>
            <CardImageHeader imageHeight="h-36">
              <div className="p-4">
                <p className="font-semibold text-sm">Image Header</p>
                <p className="text-xs text-muted-foreground mt-1">Gradient placeholder when no image.</p>
              </div>
            </CardImageHeader>

            <CardAvatar
              name="Kenneth Gimpao"
              role="Frontend Engineer"
            >
              <div className="mt-2 flex gap-1 flex-wrap">
                <Badge variant="secondary" size="sm">React</Badge>
                <Badge variant="secondary" size="sm">TypeScript</Badge>
              </div>
            </CardAvatar>

            <CardStatMini
              label="Total Revenue"
              value="$48,295"
              trend="up"
              trendValue="12.4% this month"
              icon={<span className="text-lg">💰</span>}
            />

            <CardPricing
              plan="Pro"
              price="$29"
              highlighted
              features={["Unlimited projects", "Priority support", "Custom domain"]}
              action={<Button fullWidth variant="secondary">Get Started</Button>}
            />

            <CardNotification
              variant="success"
              title="Deployment successful"
              message="Your project is live at codego.dev"
              onDismiss={() => {}}
            />

            <CardSkeleton />
          </Grid>
        </Playground>
      </Section>

      {/* ── Props ── */}
      <Section id="props">
        <PropsTable rows={[
          { prop: "Card",                  type: "HTMLDivElement",       description: "Base card — glass bg, rounded-xl, shadow-lg." },
          { prop: "CardFlat",              type: "HTMLDivElement",       description: "Flat card with border, no shadow." },
          { prop: "CardElevated",          type: "HTMLDivElement",       description: "Deep shadow-2xl elevation." },
          { prop: "CardOutlined",          type: "HTMLDivElement",       description: "2px border, transparent background." },
          { prop: "CardGhost",             type: "HTMLDivElement",       description: "Transparent with hover accent." },
          { prop: "CardGlass",             type: "HTMLDivElement",       description: "Frosted glass with backdrop-blur." },
          { prop: "CardGradientPrimary",   type: "HTMLDivElement",       description: "Indigo → Blue gradient." },
          { prop: "CardGradientDark",      type: "HTMLDivElement",       description: "Neutral 900 → 700 gradient." },
          { prop: "CardGradientSunset",    type: "HTMLDivElement",       description: "Orange → Pink gradient." },
          { prop: "CardGradientOcean",     type: "HTMLDivElement",       description: "Cyan → Blue gradient." },
          { prop: "CardGradientForest",    type: "HTMLDivElement",       description: "Emerald → Teal gradient." },
          { prop: "CardGlowPrimary",       type: "HTMLDivElement",       description: "Primary color outer glow." },
          { prop: "CardGlowSuccess",       type: "HTMLDivElement",       description: "Success color outer glow." },
          { prop: "CardGlowDanger",        type: "HTMLDivElement",       description: "Danger color outer glow." },
          { prop: "CardGlowWarning",       type: "HTMLDivElement",       description: "Warning color outer glow." },
          { prop: "CardGlowInfo",          type: "HTMLDivElement",       description: "Info color outer glow." },
          { prop: "CardTintedPrimary",     type: "HTMLDivElement",       description: "10% primary tinted background." },
          { prop: "CardTintedSuccess",     type: "HTMLDivElement",       description: "10% success tinted background." },
          { prop: "CardTintedDanger",      type: "HTMLDivElement",       description: "10% danger tinted background." },
          { prop: "CardTintedWarning",     type: "HTMLDivElement",       description: "10% warning tinted background." },
          { prop: "CardTintedInfo",        type: "HTMLDivElement",       description: "10% info tinted background." },
          { prop: "CardBorderTopPrimary",  type: "HTMLDivElement",       description: "4px top border in primary color." },
          { prop: "CardBorderTopSuccess",  type: "HTMLDivElement",       description: "4px top border in success color." },
          { prop: "CardBorderTopDanger",   type: "HTMLDivElement",       description: "4px top border in danger color." },
          { prop: "CardBorderTopWarning",  type: "HTMLDivElement",       description: "4px top border in warning color." },
          { prop: "CardBorderLeftPrimary", type: "HTMLDivElement",       description: "4px left border in primary color." },
          { prop: "CardBorderLeftSuccess", type: "HTMLDivElement",       description: "4px left border in success color." },
          { prop: "CardBorderLeftDanger",  type: "HTMLDivElement",       description: "4px left border in danger color." },
          { prop: "CardBorderLeftWarning", type: "HTMLDivElement",       description: "4px left border in warning color." },
          { prop: "CardInteractive",       type: "HTMLDivElement",       description: "Hover lift (-translate-y-1) + shadow." },
          { prop: "CardInteractiveGlow",   type: "HTMLDivElement",       description: "Hover primary glow effect." },
          { prop: "CardCompact",           type: "HTMLDivElement",       description: "Tight padding, rounded-lg." },
          { prop: "CardWide",              type: "HTMLDivElement",       description: "Full width, rounded-2xl." },
          { prop: "CardRounded",           type: "HTMLDivElement",       description: "Extra rounded corners (rounded-3xl)." },
          { prop: "CardSharp",             type: "HTMLDivElement",       description: "No border radius." },
          { prop: "CardDashed",            type: "HTMLDivElement",       description: "Dashed border style." },
          { prop: "CardDashedPrimary",     type: "HTMLDivElement",       description: "Dashed border with primary tint." },
          { prop: "CardNoise",             type: "HTMLDivElement",       description: "Subtle SVG noise texture overlay." },
          { prop: "CardMesh",              type: "HTMLDivElement",       description: "Radial mesh gradient background." },
          { prop: "CardDark",              type: "HTMLDivElement",       description: "Neutral-900 solid dark card." },
          { prop: "CardLight",             type: "HTMLDivElement",       description: "Pure white solid light card." },
          { prop: "CardFrostedDark",       type: "HTMLDivElement",       description: "Black/50 + backdrop-blur-2xl." },
          { prop: "CardFrostedLight",      type: "HTMLDivElement",       description: "White/70 + backdrop-blur-2xl." },
          { prop: "CardStripeAccent",      type: "HTMLDivElement",       description: "Gradient stripe at the top." },
          { prop: "CardStripeBottom",      type: "HTMLDivElement",       description: "Gradient stripe at the bottom." },
          { prop: "CardImageHeader",       type: "CardImageHeaderProps", description: "Card with image/gradient header. Props: imageSrc, imageAlt, imageHeight." },
          { prop: "CardAvatar",            type: "CardAvatarProps",      description: "Avatar card. Props: avatar, name, role." },
          { prop: "CardStatMini",          type: "CardStatMiniProps",    description: "Mini stat card. Props: label, value, trend, trendValue, icon." },
          { prop: "CardPricing",           type: "CardPricingProps",     description: "Pricing card. Props: plan, price, period, features, highlighted, action." },
          { prop: "CardNotification",      type: "CardNotificationProps",description: "Alert/notification card. Props: variant, title, message, icon, onDismiss." },
          { prop: "CardSkeleton",          type: "HTMLDivElement",       description: "Animated skeleton loading placeholder." },
        ]} />
      </Section>

    </DocsLayout>
  )
}
