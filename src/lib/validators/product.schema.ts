import { z } from "zod";

export const skuSchema = z.object({
  skuCode: z.string().min(1, "Vui lòng nhập mã SKU").max(64, "Mã SKU tối đa 64 ký tự"),
  variantName: z
    .string()
    .min(1, "Vui lòng nhập tên biến thể")
    .max(150, "Tên biến thể tối đa 150 ký tự"),
  price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  stockQuantity: z.coerce.number().int().min(0, "Tồn kho phải >= 0"),
});
export type SkuFormValues = z.infer<typeof skuSchema>;
export type SkuFormInput = z.input<typeof skuSchema>;

export const productSchema = z.object({
  categoryId: z.coerce.number().int().positive("Vui lòng chọn danh mục"),
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm").max(250, "Tên tối đa 250 ký tự"),
  description: z.string().max(4000).optional().or(z.literal("")),
  isPublic: z.boolean().optional(),
  skus: z.array(skuSchema).min(1, "Sản phẩm cần ít nhất 1 biến thể (SKU)"),
});
export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;

export const productBasicInfoSchema = productSchema.omit({ skus: true });
export type ProductBasicInfoValues = z.infer<typeof productBasicInfoSchema>;
export type ProductBasicInfoInput = z.input<typeof productBasicInfoSchema>;

export const discountSchema = z
  .object({
    productSkuId: z.coerce.number().int().positive("Vui lòng chọn SKU"),
    discountPercent: z.coerce
      .number()
      .gt(0, "Phần trăm giảm phải lớn hơn 0")
      .max(90, "Phần trăm giảm tối đa 90%"),
    startAt: z.string().min(1, "Vui lòng chọn thời gian bắt đầu"),
    endAt: z.string().min(1, "Vui lòng chọn thời gian kết thúc"),
  })
  .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["endAt"],
  });
export type DiscountFormValues = z.infer<typeof discountSchema>;
export type DiscountFormInput = z.input<typeof discountSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục").max(200),
  parentCategoryId: z.coerce.number().int().positive().optional().nullable(),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;
