"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { useCreateProduct } from "@/hooks/use-products";
import { ProductFormInput, ProductFormValues, productSchema } from "@/lib/validators/product.schema";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: 0,
      name: "",
      description: "",
      skus: [{ skuCode: "", variantName: "", price: 0, stockQuantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "skus" });

  function onSubmit(values: ProductFormValues) {
    createProduct.mutate(
      {
        categoryId: values.categoryId,
        name: values.name,
        description: values.description || null,
        skus: values.skus,
      },
      {
        onSuccess: (product) => {
          router.push(`/admin/products/${product.id}/edit`);
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Thêm sản phẩm mới</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Áo thun cotton nam" {...field} />
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
                    <Select value={field.value ? String(field.value) : ""} onValueChange={(v) => field.onChange(Number(v))}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn danh mục" />
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
                      <Textarea rows={4} placeholder="Mô tả chi tiết sản phẩm..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Biến thể (SKU)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                  <FormField
                    control={form.control}
                    name={`skus.${index}.variantName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tên biến thể</FormLabel>
                        <FormControl>
                          <Input placeholder="Đỏ - Size M" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skus.${index}.skuCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Mã SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="SKU-RED-M" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skus.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Giá bán (đ)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            {...field}
                            value={field.value as number | string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skus.${index}.stockQuantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tồn kho</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            value={field.value as number | string}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      disabled={fields.length <= 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {form.formState.errors.skus?.root && (
                <p className="text-sm text-destructive">{form.formState.errors.skus.root.message}</p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ skuCode: "", variantName: "", price: 0, stockQuantity: 0 })}
              >
                <Plus className="size-4" />
                Thêm biến thể
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
              Hủy
            </Button>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending && <Loader2 className="size-4 animate-spin" />}
              Tạo sản phẩm
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
