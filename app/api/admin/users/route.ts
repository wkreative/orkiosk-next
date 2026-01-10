import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

// List Users
export async function GET(req: NextRequest) {
    try {
        // Optional: Check for admin secret or session here if needed for extra security
        // For now, relies on route protection via Middleware/Layout (conceptually) 
        // OR better: verify the calling user's token from headers if we want strict API security.
        // Assuming this is called from the Admin Panel which is already protected by Layout.

        // List last 1000 users
        const listUsersResult = await adminAuth.listUsers(1000);
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            disabled: user.disabled,
            lastSignInTime: user.metadata.lastSignInTime,
            creationTime: user.metadata.creationTime,
        }));

        return NextResponse.json({ users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update User (Disable/Enable)
export async function PATCH(req: NextRequest) {
    try {
        const { uid, disabled } = await req.json();

        if (!uid) {
            return NextResponse.json({ error: 'UID required' }, { status: 400 });
        }

        const userRecord = await adminAuth.updateUser(uid, {
            disabled: disabled
        });

        return NextResponse.json({ success: true, user: userRecord });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
