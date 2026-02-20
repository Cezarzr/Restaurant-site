import { prisma } from "@/lib/db";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p>Business email: {settings?.businessEmail}</p>
      <p>Min notice hours: {settings?.minNoticeHours}</p>
      <p>Default slots: {settings?.defaultTimeSlots.join(", ")}</p>
      <p>Notification recipients: {settings?.notificationEmails.join(", ")}</p>
    </div>
  );
}
