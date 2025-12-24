# Scripts Documentation

## Migration Script

### `migrate-posts.js`

This script migrates blog posts from markdown files in `content/posts/` to Firebase Firestore.

**⚠️ Important:** This script should be run **manually** and **only when needed**, not during the build process.

### When to Use

- When you have new markdown posts in `content/posts/` that need to be added to Firestore
- When migrating from a file-based blog to Firebase
- When you need to bulk update posts in Firestore

### Prerequisites

1. **Service Account Key:** Download from [Firebase Console](https://console.firebase.google.com/project/orkiosk-web/settings/serviceaccounts/adminsdk)
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in the project root

2. **Markdown Posts:** Place your `.md` files in `content/posts/`

### How to Run

```bash
npm run migrate
```

### What It Does

1. Reads all `.md` files from `content/posts/`
2. Parses frontmatter and content
3. Creates/updates documents in Firestore `posts` collection
4. Uses the slug as the document ID

### Post Format

Your markdown files should have frontmatter like this:

```markdown
---
title: "My Post Title"
slug: "my-post-slug"
excerpt: "Short description"
date: "2024-01-01"
author: "Author Name"
category: "Category"
image: "/images/post.jpg"
---

Post content here...
```

### Troubleshooting

**Error: serviceAccountKey.json not found**
- Download the service account key from Firebase Console
- Save it as `serviceAccountKey.json` in the project root
- Make sure it's in `.gitignore` (it should be by default)

**Permission Denied**
- Verify your service account has Firestore write permissions
- Check Firebase Console > IAM & Admin

### Security Note

🔒 **Never commit `serviceAccountKey.json` to version control!** It contains sensitive credentials.
