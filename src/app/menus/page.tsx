import { prisma } from "@/lib/db";

export default async function MenusPage() {
  const categories = await prisma.menuCategory.findMany({ include: { items: { orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Menus</h1>
      <div className="mt-6 space-y-6">
        {categories.map((category) => (
          <section key={category.id} className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="text-sm text-stone-500">{category.type}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {category.items.map((item) => (
                <li key={item.id} className="rounded border p-3">
                  <div className="flex justify-between"><span className="font-medium">{item.name}</span><span>${item.price.toString()}</span></div>
                  <p className="text-sm text-stone-600">{item.description}</p>
                  <p className="text-xs text-stone-500">{item.dietaryTags.join(", ")}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
