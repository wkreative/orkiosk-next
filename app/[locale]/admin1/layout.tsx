import AdminLayout from '@/components/admin/AdminLayout'

export const dynamic = 'force-static'
export const dynamicParams = true

export default function Admin1Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AdminLayout>{children}</AdminLayout>
}
