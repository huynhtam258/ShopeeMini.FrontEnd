"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddSku } from "@/hooks/use-products";
import { SkuFormInput, SkuFormValues, skuSchema } from "@/lib/validators/product.schema";

export function AddSkuDialog({ productId }: { productId: number }) {
  const [open, setOpen] = useState(false);
  const addSku = useAddSku();
  const form = useForm<SkuFormInput, unknown, SkuFormValues>({
    resolver: zodResolver(skuSchema),
    defaultValues: { skuCode: "", variantName: "", price: 0, stockQuantity: 0 },
  });

  function onSubmit(values: SkuFormValues) {
    addSku.mutate(
      { productId, payload: values },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1.5 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary">
        <Plus className="size-4" />
        Thêm biến thể mới
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm biến thể (SKU) mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="variantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên biến thể</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Đỏ - Size M" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skuCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU-RED-M" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá bán (đ)</FormLabel>
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
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tồn kho</FormLabel>
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
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addSku.isPending}>
                {addSku.isPending && <Loader2 className="size-4 animate-spin" />}
                Thêm biến thể
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
