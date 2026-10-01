export function Footer() {
  return (
    <footer className="mt-12 border-t bg-card py-8">
      <div className="mx-auto max-w-7xl px-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">ShopeeMini</p>
        <p className="mt-1">Đồ án minh họa E-commerce — Chỉ dùng cho mục đích học tập.</p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} ShopeeMini. All rights reserved.</p>
      </div>
    </footer>
  );
}
