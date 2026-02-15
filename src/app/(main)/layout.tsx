import { Sidebar } from '@/components/layout/Sidebar';
import { MobileBottomNav } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 flex flex-col relative z-0">
                <div className="flex-1 max-w-full mx-auto w-full">
                    {children}
                </div>
                <Footer />
            </main>
            <MobileBottomNav />
        </div>
    );
}
