"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Minus, PackageSearch, Plus, ShoppingCart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { PriceDisplay } from "@/components/common/price-display";
import { SkuSelector } from "@/components/product/sku-selector";
import { useProductDetail } from "@/hooks/use-products";
import { useAddCartItem } from "@/hooks/use-cart";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data: product, isLoading } = useProductDetail(Number.isFinite(productId) ? productId : null);
  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addCartItem = useAddCartItem();

  const selectedSku = useMemo(
    () => product?.skus.find((s) => s.id === (selectedSkuId ?? product.skus[0]?.id)),
    [product, selectedSkuId]
  );

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <EmptyState title="Không tìm thấy sản phẩm" description="Sản phẩm có thể đã bị ẩn hoặc không tồn tại." />;
  }

  const activeSku = selectedSku ?? product.skus[0];
  const hasDiscount = (activeSku?.activeDiscountPercent ?? 0) > 0;

  function requireLoginAsUser(): boolean {
    if (!user) {
      toast.info("Vui lòng đăng nhập để tiếp tục.");
      router.push("/login");
      return false;
    }
    if (user.role !== "User") {
      toast.error("Tài khoản quản trị không thể mua hàng.");
      return false;
    }
    return true;
  }

  function handleAddToCart(redirectToCheckout: boolean) {
    if (!activeSku) return;
    if (!requireLoginAsUser()) return;

    addCartItem.mutate(
      { productSkuId: activeSku.id, quantity },
      {
        onSuccess: () => {
          if (redirectToCheckout) router.push("/cart");
        },
      }
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
          <PackageSearch className="size-20 text-muted-foreground/30" strokeWidth={1} />
        </div>

        <div className="space-y-5">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.categoryName}
            </Badge>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Cửa hàng: {product.shopName}</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <PriceDisplay
              price={activeSku?.price ?? 0}
              effectivePrice={activeSku?.effectivePrice}
              discountPercent={hasDiscount ? activeSku?.activeDiscountPercent : undefined}
              size="lg"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Kho: {activeSku?.stockQuantity ?? 0} sản phẩm
            </p>
          </div>

          <SkuSelector
            skus={product.skus}
            selectedSkuId={activeSku?.id ?? null}
            onSelect={(id) => {
              setSelectedSkuId(id);
              setQuantity(1);
            }}
          />

          <div className="space-y-2">
            <p className="text-sm font-medium">Số lượng</p>
            <div className="flex w-fit items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={!activeSku || quantity >= activeSku.stockQuantity}
                onClick={() =>
                  setQuantity((q) => Math.min(activeSku?.stockQuantity ?? q, q + 1))
                }
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              disabled={!activeSku || activeSku.stockQuantity <= 0 || addCartItem.isPending}
              onClick={() => handleAddToCart(false)}
            >
              {addCartItem.isPending ? <Loader2 className="size-4 animate-spin" /> : <ShoppingCart className="size-4" />}
              Thêm vào giỏ hàng
            </Button>
            <Button
              className="flex-1 gap-2"
              disabled={!activeSku || activeSku.stockQuantity <= 0 || addCartItem.isPending}
              onClick={() => handleAddToCart(true)}
            >
              <Zap className="size-4" />
              Mua ngay
            </Button>
          </div>
        </div>
      </div>

      {product.description && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Mô tả sản phẩm</h2>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{product.description}</p>
        </div>
      )}
    </div>
  );
}
