import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Settings2 } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { formatPrice, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";

const AdminProducts = () => {
  const { products, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({ ...product });
  };

  const handleSave = () => {
    if (!editProduct || !form.name?.trim()) {
      toast.error("Nomi bo'sh bo'lmasligi kerak");
      return;
    }
    const price = Number(form.price) || 0;
    const costPrice = Number(form.costPrice) || 0;
    const oldPrice = Number(form.oldPrice) || 0;
    const discount = oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    updateProduct(editProduct.id, {
      name: form.name,
      price,
      costPrice,
      oldPrice,
      discount,
      category: form.category || "Qurilish mollari",
      stock: form.stock || "",
      description: form.description || "",
      image: form.image,
    });
    setEditProduct(null);
    toast.success("Mahsulot yangilandi");
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}" ni o'chirishni xohlaysizmi?`)) {
      deleteProduct(id);
      toast.success("Mahsulot o'chirildi");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mahsulotlar</h1>
          <p className="text-sm text-muted-foreground">{products.length} ta mahsulot</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Qo'shish
        </Button>
      </div>

      {/* Search */}
      <div className="relative mt-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Mahsulot qidirish..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product list */}
      <div className="mt-6 space-y-1 rounded-xl border bg-background">
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-muted-foreground">Mahsulot topilmadi</div>
        )}
        {filtered.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between border-b px-6 py-4 last:border-0"
          >
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.name}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {product.category}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-sm">
                  <span className="font-medium text-primary">{formatPrice(product.price)}</span>
                  <span className="text-muted-foreground">
                    Tannarx: {formatPrice(product.costPrice || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <span>{product.stock}</span>
                  {product.variants && product.variants.length > 0 && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Settings2 className="h-3 w-3" /> {product.variants.length} variant
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEdit(product)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(o) => !o && setEditProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="asosiy">
            <TabsList className="w-full">
              <TabsTrigger value="asosiy" className="flex-1">Asosiy</TabsTrigger>
              <TabsTrigger value="rasmlar" className="flex-1">Rasmlar</TabsTrigger>
              <TabsTrigger value="variantlar" className="flex-1">Variantlar</TabsTrigger>
            </TabsList>

            <TabsContent value="asosiy" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nomi *</label>
                  <Input
                    className="mt-1"
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input className="mt-1" value={form.id || ""} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Kategoriya</label>
                  <Select
                    value={form.category || "Qurilish mollari"}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Qurilish mollari">Qurilish mollari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Artikul (SKU)</label>
                  <Input className="mt-1" placeholder="" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tavsif</label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Tannarx *</label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={form.costPrice ?? 0}
                    onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sotuv narxi *</label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={form.price ?? 0}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Eski narx</label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={form.oldPrice ?? 0}
                    onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Omborda</label>
                  <Input
                    className="mt-1"
                    value={form.stock || ""}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Rasm URL</label>
                  <Input
                    className="mt-1"
                    value={form.image || ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rasmlar" className="pt-4">
              <div className="flex flex-col items-center gap-4 py-8">
                {form.image && (
                  <img src={form.image} alt="" className="h-40 w-40 rounded-lg object-cover" />
                )}
                <p className="text-sm text-muted-foreground">Rasm URL ni "Asosiy" tabda o'zgartiring</p>
              </div>
            </TabsContent>

            <TabsContent value="variantlar" className="pt-4">
              <div className="space-y-2">
                {form.variants && form.variants.length > 0 ? (
                  form.variants.map((v, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                      <span className="flex-1 text-sm font-medium">{v.label}</span>
                      <span className="text-sm text-muted-foreground">{formatPrice(v.price)}</span>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">Variantlar yo'q</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setEditProduct(null)}>Bekor</Button>
            <Button onClick={handleSave}>Saqlash</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
