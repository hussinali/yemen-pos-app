import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ShoppingCart, Package, Users, BarChart3, Settings, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: lowStockProducts } = trpc.inventory.lowStockProducts.useQuery(
    { branchId: 1 },
    { enabled: isAuthenticated }
  );
  const { data: notifications } = trpc.notifications.list.useQuery(
    { unreadOnly: true },
    { enabled: isAuthenticated }
  );

  const [, navigate] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center p-4">
        <Card className="bg-card border-border p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">نظام نقاط البيع اليمني</h1>
          <p className="text-muted-foreground mb-6">
            نظام متكامل لإدارة المبيعات والمخزون والعملاء
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="w-full bg-accent text-accent-foreground hover:opacity-90"
          >
            تسجيل الدخول
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">مرحباً، {user?.name}</h1>
            <p className="text-muted-foreground mt-1">لوحة التحكم الرئيسية</p>
          </div>
          <Button
            onClick={() => logout()}
            variant="outline"
            className="border-border text-foreground hover:bg-muted/20"
          >
            <LogOut size={20} className="ml-2" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate("/pos")}
            className="block"
          >
            <Card className="bg-card border-border p-6 hover:border-accent transition-colors cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <ShoppingCart className="text-accent" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">نقطة البيع</p>
                  <p className="text-lg font-bold text-foreground">بيع جديد</p>
                </div>
              </div>
            </Card>
          </button>

          <button
            onClick={() => navigate("/products")}
            className="block"
          >
            <Card className="bg-card border-border p-6 hover:border-accent transition-colors cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <Package className="text-accent" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">المنتجات</p>
                  <p className="text-lg font-bold text-foreground">إدارة</p>
                </div>
              </div>
            </Card>
          </button>

          <button
            onClick={() => navigate("/customers")}
            className="block"
          >
            <Card className="bg-card border-border p-6 hover:border-accent transition-colors cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <Users className="text-accent" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">العملاء</p>
                  <p className="text-lg font-bold text-foreground">إدارة</p>
                </div>
              </div>
            </Card>
          </button>

          <button
            onClick={() => navigate("/reports")}
            className="block"
          >
            <Card className="bg-card border-border p-6 hover:border-accent transition-colors cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <BarChart3 className="text-accent" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">التقارير</p>
                  <p className="text-lg font-bold text-foreground">عرض</p>
                </div>
              </div>
            </Card>
          </button>
        </div>

        {/* Alerts and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">⚠️ تنبيهات المخزون</h2>
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((item: any) => (
                  <div key={item.id} className="flex justify-between p-3 bg-background rounded">
                    <div>
                      <p className="text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-destructive">
                        المخزون: {item.quantity} / الحد الأدنى: {item.minStock}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-destructive/20 text-destructive text-xs rounded">
                        منخفض
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">✓ جميع المنتجات بمستوى مخزون آمن</p>
            )}
          </Card>

          {/* Recent Notifications */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">🔔 الإشعارات الأخيرة</h2>
            {notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notif: any) => (
                  <div key={notif.id} className="flex justify-between p-3 bg-background rounded">
                    <div className="text-right flex-1">
                      <p className="text-sm text-foreground font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(notif.createdAt).toLocaleDateString("ar-YE")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">لا توجد إشعارات جديدة</p>
            )}
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="bg-card border-border p-6 mt-6">
          <h2 className="text-xl font-bold text-foreground mb-4">📊 إحصائيات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background rounded">
              <p className="text-2xl font-bold text-accent">0</p>
              <p className="text-sm text-muted-foreground">مبيعات اليوم</p>
            </div>
            <div className="text-center p-4 bg-background rounded">
              <p className="text-2xl font-bold text-success">0</p>
              <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
            </div>
            <div className="text-center p-4 bg-background rounded">
              <p className="text-2xl font-bold text-warning">0</p>
              <p className="text-sm text-muted-foreground">المنتجات</p>
            </div>
            <div className="text-center p-4 bg-background rounded">
              <p className="text-2xl font-bold text-info">0</p>
              <p className="text-sm text-muted-foreground">العملاء</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
