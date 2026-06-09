import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLinksByUserId } from "@/data/links";
import { CreateLinkDialog } from "./CreateLinkDialog";
import { LinkActions } from "./LinkActions";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";
  const userLinks = user ? await getLinksByUserId(user.id) : [];

  const stats = [
    { label: "Total Links", value: String(userLinks.length) },
    { label: "Total Clicks", value: "0" },
  ];

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
          <CreateLinkDialog
            trigger={
              <Button className="mt-4 sm:mt-0">+ Shorten a link</Button>
            }
          />
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

          {userLinks.length === 0 ? (
            <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
              <span className="text-4xl">🔗</span>
              <p className="text-sm font-medium text-foreground">No links yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Shorten your first URL and it will appear here.
              </p>
              <CreateLinkDialog
                trigger={
                  <Button variant="outline">+ Shorten a link</Button>
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short Link</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      <a
                        href={`/r/${link.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        /r/{link.slug}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {link.originalUrl}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {link.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <LinkActions link={link} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </main>
  );
}
