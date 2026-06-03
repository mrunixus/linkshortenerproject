import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "⚡",
    title: "Instant Shortening",
    description:
      "Paste any long URL and get a clean, shareable short link in seconds.",
  },
  {
    icon: "📊",
    title: "Click Analytics",
    description:
      "Track how many times your links are clicked from your dashboard.",
  },
  {
    icon: "🔒",
    title: "Your Links, Your Data",
    description:
      "Each link is scoped to your account — no one else can see or edit them.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex w-full flex-col items-center gap-6 px-6 py-24 text-center md:py-36">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Shorten links.{" "}
          <span className="text-muted-foreground">Share smarter.</span>
        </h1>
        <p className="max-w-lg text-lg leading-8 text-muted-foreground">
          Create short, memorable links in seconds. Manage them all from one
          place and see exactly who&apos;s clicking.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <SignUpButton mode="modal">
            <Button size="lg">Get started — it&apos;s free</Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="w-full max-w-4xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h2 className="text-base font-semibold text-foreground">
                {feature.title}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
