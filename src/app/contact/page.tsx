import { prisma } from "@/lib/db";

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p>Email: {settings?.businessEmail ?? "hello@example.com"}</p>
      <p>Phone: {settings?.businessPhone ?? "N/A"}</p>
      <form className="grid gap-3 max-w-xl">
        <input className="rounded border p-2" placeholder="Name" />
        <input className="rounded border p-2" placeholder="Email" />
        <textarea className="rounded border p-2" placeholder="Message" />
        <button className="rounded bg-brand px-4 py-2 text-white">Send</button>
      </form>
    </div>
  );
}
