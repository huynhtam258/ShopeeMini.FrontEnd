"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCreateDiscount } from "@/hooks/use-products";
import { toDateTimeLocalInputValue } from "@/lib/format";
import {
  DiscountFormInput,
  DiscountFormValues,
  discountSchema,
} from "@/lib/validators/product.schema";
import { SkuDto } from "@/types";

export function CreateDiscountDialog({ sku }: { sku: SkuDto }) {
  const [open, setOpen] = useState(false);
  const createDiscount = useCreateDiscount();

  const now = new Date();
  const inOneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const form = useForm<DiscountFormInput, unknown, DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      productSkuId: sku.id,
      discountPercent: 10,
      startAt: toDateTimeLocalInputValue(now),
      endAt: toDateTimeLocalInputValue(inOneWeek),
    },
  });

  function onSubmit(values: DiscountFormValues) {
    createDiscount.mutate(
      {
        productSkuId: values.productSkuId,
        discountPercent: values.discountPercent,
        startAt: new Date(values.startAt).toISOString(),
        endAt: new Date(values.endAt).toISOString(),
      },
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
      <DialogTrigger className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        <Tag className="size-3.5" />
        {sku.activeDiscountPercent > 0 ? "Cập nhật giảm giá" : "Thiết lập giảm giá"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cấu hình giảm giá: {sku.variantName}</DialogTitle>
          <DialogDescription>
            Áp dụng phần trăm giảm giá trong một khoảng thời gian xác định.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="discountPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phần trăm giảm (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={90}
                      step={1}
                      {...field}
                      value={field.value as number | string}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kết thúc</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createDiscount.isPending}>
                {createDiscount.isPending && <Loader2 className="size-4 animate-spin" />}
                Lưu chương trình giảm giá
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
