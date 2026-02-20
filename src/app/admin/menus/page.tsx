"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string; type: string; sortOrder: number; isActive: boolean; items: Item[] };
type Item = { id: string; name: string; price: string; available: boolean; sortOrder: number; categoryId: string };

export default function AdminMenusPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", type: "Lunch" });
  const [newItem, setNewItem] = useState({ categoryId: "", name: "", price: "0" });

  async function load() {
    const res = await fetch("/api/admin/menus/categories", { cache: "no-store" });
    const data = await res.json();
    setCategories(data);
    if (!newItem.categoryId && data[0]?.id) setNewItem((s) => ({ ...s, categoryId: data[0].id }));
  }

  useEffect(() => { void load(); }, []);

  async function createCategory() {
    await fetch("/api/admin/menus/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCategory, sortOrder: categories.length + 1 }),
    });
    setNewCategory({ name: "", type: "Lunch" });
    await load();
  }

  async function createItem() {
    await fetch("/api/admin/menus/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newItem, price: Number(newItem.price), dietaryTags: [], sortOrder: 1 }),
    });
    setNewItem((s) => ({ ...s, name: "", price: "0" }));
    await load();
  }

  async function toggleItem(item: Item) {
    await fetch("/api/admin/menus/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, available: !item.available }),
    });
    await load();
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Manage Menus</h1>

      <div className="grid gap-3 md:grid-cols-3">
        <input placeholder="Category name" className="rounded border p-2" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
        <input placeholder="Type" className="rounded border p-2" value={newCategory.type} onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })} />
        <button className="rounded border px-3 py-2" onClick={createCategory}>Add category</button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <select className="rounded border p-2" value={newItem.categoryId} onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Item name" className="rounded border p-2" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <input placeholder="Price" className="rounded border p-2" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
        <button className="rounded border px-3 py-2" onClick={createItem}>Add item</button>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="rounded border bg-white p-4">
          <h2 className="font-semibold">{cat.name} <span className="text-sm text-stone-500">({cat.type})</span></h2>
          <ul className="mt-2 space-y-2">
            {cat.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded border p-2">
                <span>{item.name} - ${String(item.price)}</span>
                <button className="rounded border px-2 py-1" onClick={() => toggleItem(item)}>{item.available ? "Mark 86'd" : "Mark available"}</button>
              </li>
            ))}
            {!cat.items.length && <li className="text-sm text-stone-500">No items yet.</li>}
          </ul>
        </div>
      ))}
    </div>
  );
}
