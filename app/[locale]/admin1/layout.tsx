import AdminLayout from '@/components/admin/AdminLayout'
import { ThemeProvider } from '@/components/ThemeProvider'

// dynamic export removed to allow proper auth handling

export default function Admin1Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
            <AdminLayout>{children}</AdminLayout>
        </ThemeProvider>
    )
}
