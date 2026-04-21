import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, Plus, Trash2, ShoppingCart } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export default function POSInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer" | "credit_card">("cash");

  const { data: products, isLoading } = trpc.products.list.useQuery();

  const filteredProducts = products
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode?.includes(searchQuery)
      )
    : [];

  const addToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: parseFloat(product.sellingPrice.toString()),
          quantity: 1,
          subtotal: parseFloat(product.sellingPrice.toString()),
        },
      ]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.price,
              }
            : item
        )
      );
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-4">نقطة البيع</h1>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="ابحث عن المنتج بالاسم أو الباركود..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 bg-card text-foreground border-border"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="p-4 bg-card border-border hover:border-accent transition-colors cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="text-right">
                    <h3 className="font-bold text-foreground truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.barcode}</p>
                    <p className="text-lg font-bold text-accent mt-2">
                      {parseFloat(product.sellingPrice.toString()).toFixed(2)} ر.ي
                    </p>
                    <p className="text-xs text-muted-foreground">
                      المخزون: {product.minStock}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="text-accent" size={24} />
              <h2 className="text-2xl font-bold text-foreground">العربة</h2>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>العربة فارغة</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-background p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="text-right flex-1">
                          <p className="font-semibold text-foreground text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.price.toFixed(2)} ر.ي
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-accent text-accent-foreground rounded text-sm"
                        >
                          +
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value) || 0)
                          }
                          className="w-10 h-6 bg-input text-foreground text-center text-sm rounded"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-muted text-muted-foreground rounded text-sm"
                        >
                          −
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الإجمالي:</span>
                    <span className="text-foreground font-semibold">
                      {subtotal.toFixed(2)} ر.ي
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الضريبة (5%):</span>
                    <span className="text-foreground font-semibold">
                      {tax.toFixed(2)} ر.ي
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                    <span className="text-foreground">المجموع:</span>
                    <span className="text-accent">{total.toFixed(2)} ر.ي</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    طريقة الدفع
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "cash" | "bank_transfer" | "credit_card")
                    }
                    className="w-full bg-input text-foreground border border-border rounded p-2 text-sm"
                  >
                    <option value="cash">نقداً</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="credit_card">بطاقة ائتمان</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full bg-success text-success-foreground hover:opacity-90 py-2">
                    إتمام البيع (F10)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-muted/20"
                    onClick={() => setCartItems([])}
                  >
                    إلغاء
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
