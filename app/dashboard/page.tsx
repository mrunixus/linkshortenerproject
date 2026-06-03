import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Links", value: "0" },
  { label: "Total Clicks", value: "0" },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <main className="flex flex-col items-center">
      {/* Page header */}
      <section className="w-full max-w-4xl px-6 py-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track all your short links in one place.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0">+ Shorten a link</Button>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full max-w-4xl px-6 pb-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Links table / empty state */}
      <section className="w-full max-w-4xl px-6 pb-24">
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              Your Links
            </h2>
          </div>
          <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span className="text-4xl">🔗</span>
            <p className="text-sm font-medium text-foreground">
              No links yet
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Shorten your first URL and it will appear here.
            </p>
            <Button variant="outline">+ Shorten a link</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
