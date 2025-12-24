const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// To run this, you need a service account key from Firebase Console
// Project Settings > Service Accounts > Generate New Private Key
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('Error: serviceAccountKey.json not found in the root directory.');
    console.log('Please download it from Firebase Console and save it as serviceAccountKey.json');
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const postsDirectory = path.join(__dirname, '../content/posts');

async function migrate() {
    const fileNames = fs.readdirSync(postsDirectory);

    for (const fileName of fileNames) {
        if (!fileName.endsWith('.md')) continue;

        console.log(`Migrando: ${fileName}...`);
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const slug = data.slug || fileName.replace(/\.md$/, '');

        const postData = {
            slug,
            title: data.title || 'Sin título',
            excerpt: data.excerpt || '',
            date: data.date || new Date().toISOString(),
            content: content,
            author: data.author || 'Admin',
            category: data.category || 'General',
            image: data.image || '',
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('posts').doc(slug).set(postData);
        console.log(`✓ ${slug} migrado correctamente.`);
    }

    console.log('Migración completada.');
}

migrate().catch(console.error);
