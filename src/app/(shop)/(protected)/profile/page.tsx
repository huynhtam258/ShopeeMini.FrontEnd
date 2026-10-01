"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { useChangePassword, useProfile } from "@/hooks/use-auth";
import { formatDateTime } from "@/lib/format";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/lib/validators/auth.schema";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const changePassword = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  function onSubmit(values: ChangePasswordFormValues) {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => form.reset() }
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold">Thông tin cá nhân</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hồ sơ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {isLoading || !profile ? (
            <p className="text-muted-foreground">Đang tải...</p>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Họ và tên</span>
                <span className="font-medium">{profile.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại</span>
                <span className="font-medium">{profile.phone ?? "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vai trò</span>
                <Badge variant="secondary">{profile.role === "Admin" ? "Quản trị viên" : "Khách hàng"}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tham gia</span>
                <span className="font-medium">{formatDateTime(profile.createdAt)}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending && <Loader2 className="size-4 animate-spin" />}
                Cập nhật mật khẩu
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
