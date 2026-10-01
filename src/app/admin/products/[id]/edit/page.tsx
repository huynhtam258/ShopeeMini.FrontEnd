"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SkuManagementTable } from "@/components/admin/sku-management-table";
import { useCategories } from "@/hooks/use-categories";
import { useAdminProductDetail, useSetProductStatus, useUpdateProduct } from "@/hooks/use-products";
import {
  ProductBasicInfoInput,
  ProductBasicInfoValues,
  productBasicInfoSchema,
} from "@/lib/validators/product.schema";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const router = useRouter();

  const { data: product, isLoading } = useAdminProductDetail(Number.isFinite(productId) ? productId : null);
  const { data: categories = [] } = useCategories();
  const updateProduct = useUpdateProduct();
  const setStatus = useSetProductStatus();
  const [confirmHide, setConfirmHide] = useState(false);

  const form = useForm<ProductBasicInfoInput, unknown, ProductBasicInfoValues>({
    resolver: zodResolver(productBasicInfoSchema),
    defaultValues: { categoryId: 0, name: "", description: "" },
    values: product
      ? {
          categoryId: product.categoryId,
          name: product.name,
          description: product.description ?? "",
        }
      : undefined,
  });

  useEffect(() => {
    if (!isLoading && !product) {
      router.replace("/admin/products");
    }
  }, [isLoading, product, router]);

  if (isLoading || !product) {
    return <p className="py-10 text-center text-muted-foreground">Đang tải sản phẩm...</p>;
  }

  function onSubmit(values: ProductBasicInfoValues) {
    updateProduct.mutate({
      id: productId,
      payload: {
        categoryId: values.categoryId,
        name: values.name,
        description: values.description || null,
      },
    });
  }

  function handleToggleStatus(nextValue: boolean) {
    if (!nextValue) {
      setConfirmHide(true);
      return;
    }
    setStatus.mutate({ id: productId, payload: { isPublic: true } });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Chỉnh sửa sản phẩm</h1>
        <div className="flex items-center gap-2">
          <Badge variant={product.isPublic ? "default" : "secondary"}>
            {product.isPublic ? "Đang hiển thị" : "Đang ẩn"}
          </Badge>
          <Switch
            checked={product.isPublic}
            disabled={setStatus.isPending}
            onCheckedChange={handleToggleStatus}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updateProduct.isPending}>
                {updateProduct.isPending && <Loader2 className="size-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Biến thể & giá (SKU)</CardTitle>
        </CardHeader>
        <CardContent>
          <SkuManagementTable productId={productId} skus={product.skus} />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmHide}
        onOpenChange={setConfirmHide}
        title="Ẩn sản phẩm khỏi cửa hàng?"
        description="Sản phẩm sẽ bị xóa khỏi giỏ hàng của tất cả khách hàng đang chứa sản phẩm này và họ sẽ nhận được thông báo."
        confirmText="Ẩn sản phẩm"
        destructive
        loading={setStatus.isPending}
        onConfirm={() => {
          setStatus.mutate(
            { id: productId, payload: { isPublic: false } },
            { onSuccess: () => setConfirmHide(false) }
          );
        }}
      />
    </div>
  );
}
