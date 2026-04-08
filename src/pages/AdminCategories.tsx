import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminLayout from "@/components/AdminLayout";
import { useCategories, Category } from "@/context/CategoryContext";
import { toast } from "sonner";

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", order: 0, active: true });

  const openAdd = () => {
    setEditCat(null);
    setForm({ name: "", slug: "", order: 0, active: true });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditCat(cat);
    setForm({ name: cat.name, slug: cat.slug, order: cat.order, active: cat.active });
    setDialogOpen(true);
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNameChange = (name: string) => {
    setForm({ ...form, name, slug: editCat ? form.slug : generateSlug(name) });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Nomi bo'sh bo'lmasligi kerak");
      return;
    }
    const slug = form.slug || generateSlug(form.name);
    if (editCat) {
      updateCategory(editCat.id, { ...form, slug });
      toast.success("Kategoriya yangilandi");
    } else {
      addCategory({ ...form, slug });
      toast.success("Kategoriya qo'shildi");
    }
    setDialogOpen(false);
  };

  const handleDelete = (cat: Category) => {
    if (confirm(`"${cat.name}" ni o'chirishni xohlaysizmi?`)) {
      deleteCategory(cat.id);
      toast.success("Kategoriya o'chirildi");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kategoriyalar</h1>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Qo'shish
        </Button>
      </div>

      <div className="mt-6 space-y-1 rounded-xl border bg-background">
        {categories.length === 0 && (
          <div className="px-6 py-12 text-center text-muted-foreground">Kategoriya topilmadi</div>
        )}
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between border-b px-6 py-4 last:border-0">
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{cat.name}</div>
                <div className="text-xs text-muted-foreground">{cat.slug}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={cat.active}
                onCheckedChange={(v) => updateCategory(cat.id, { active: v })}
              />
              <button
                onClick={() => openEdit(cat)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editCat ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Nomi *</label>
              <Input
                className="mt-1"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input
                className="mt-1"
                value={form.slug}
                placeholder="avtomatik generatsiya"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tartib raqami</label>
              <Input
                type="number"
                className="mt-1"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <span className="text-sm">Faol</span>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor</Button>
              <Button onClick={handleSave}>{editCat ? "Saqlash" : "Qo'shish"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;
