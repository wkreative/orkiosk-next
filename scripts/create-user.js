const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.error('Usage: node scripts/create-user.js <email> <password>');
    process.exit(1);
}

async function createUser() {
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            emailVerified: true,
            disabled: false
        });
        console.log('Successfully created new user:', userRecord.uid);
    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            console.log('User already exists. Updating password...');
            const user = await admin.auth().getUserByEmail(email);
            await admin.auth().updateUser(user.uid, { password: password });
            console.log('Password updated successfully.');
        } else {
            console.error('Error creating new user:', error);
        }
    }
}

createUser();
