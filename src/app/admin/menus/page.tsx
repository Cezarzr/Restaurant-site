import { prisma } from "@/lib/db";

export default async function AdminMenusPage() {
  const categories = await prisma.menuCategory.findMany({ include: { items: true }, orderBy: { sortOrder: "asc" } });
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Manage Menus</h1>
      <p className="text-sm text-stone-600">Use /api/admin/menus endpoints to create, reorder, and toggle 86'd items.</p>
      {categories.map((cat) => <div key={cat.id} className="mt-4 rounded border bg-white p-4"><h2 className="font-semibold">{cat.name}</h2><p>{cat.items.length} items</p></div>)}
    </div>
  );
}
