import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Orkiosk Admin',
    robots: {
        index: false,
        follow: false,
    },
}

export default function AdminProxyPage() {
    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
            {/* 
        Using an iframe to "proxy" the external admin panel while keeping the URL.
        This is the best approach for a static site export.
      */}
            <iframe
                src="http://35.209.116.50/"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                }}
                title="Admin Panel"
            />
        </div>
    )
}
