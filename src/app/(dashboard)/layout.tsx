// app/admin/layout.tsx
import Sidebar from '@/components/ui/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-black">
        {children}
      </main>
    </div>
  );
}
