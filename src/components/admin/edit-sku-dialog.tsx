"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useUpdateSkuPrice, useUpdateSkuStock } from "@/hooks/use-products";
import { SkuDto } from "@/types";

const schema = z.object({
  price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  stockQuantity: z.coerce.number().int().min(0, "Tồn kho phải >= 0"),
});
type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;

interface EditSkuDialogProps {
  sku: SkuDto | null;
  onOpenChange: (open: boolean) => void;
}

export function EditSkuDialog({ sku, onOpenChange }: EditSkuDialogProps) {
  const updatePrice = useUpdateSkuPrice();
  const updateStock = useUpdateSkuStock();
  const isPending = updatePrice.isPending || updateStock.isPending;

  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { price: 0, stockQuantity: 0 },
    values: sku ? { price: sku.price, stockQuantity: sku.stockQuantity } : undefined,
  });

  async function onSubmit(values: FormValues) {
    if (!sku) return;
    const tasks: Promise<unknown>[] = [];
    if (values.price !== sku.price) {
      tasks.push(updatePrice.mutateAsync({ skuId: sku.id, payload: { price: values.price } }));
    }
    if (values.stockQuantity !== sku.stockQuantity) {
      tasks.push(
        updateStock.mutateAsync({ skuId: sku.id, payload: { stockQuantity: values.stockQuantity } })
      );
    }
    if (tasks.length === 0) {
      onOpenChange(false);
      return;
    }
    await Promise.all(tasks).catch(() => undefined);
    onOpenChange(false);
  }

  return (
    <Dialog open={sku !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật biến thể: {sku?.variantName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormLabel>Số lượng tồn kho</FormLabel>
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
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
