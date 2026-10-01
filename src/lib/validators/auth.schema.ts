import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên").max(200, "Họ tên tối đa 200 ký tự"),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ").max(256),
  phone: z
    .string()
    .max(20, "Số điện thoại tối đa 20 ký tự")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Mật khẩu phải có từ 6 đến 100 ký tự")
    .max(100, "Mật khẩu phải có từ 6 đến 100 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z
    .string()
    .min(6, "Mật khẩu mới phải có từ 6 đến 100 ký tự")
    .max(100, "Mật khẩu mới phải có từ 6 đến 100 ký tự"),
  confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmNewPassword"],
});
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
