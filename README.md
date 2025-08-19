# Scanzaclip — Permissions Starter

This starter gives you:
- Firestore collections for permission requests, assignments, notifications, audit logs
- Next.js API routes: request-permission, approve-permission
- React chat-like widget to interact with approvals
- i18n locales (th/en)
- Firestore rules for multi-role access (owner, admin, genai)

## Setup (Quick)
1. Add these files into your Next.js repo (keep folder paths).
2. Set ENV VARS (Vercel/Local):
   - FIREBASE_PROJECT_ID
   - FIREBASE_CLIENT_EMAIL
   - FIREBASE_PRIVATE_KEY  (paste with \n escaped)
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID

3. Import and render <PermissionChatWidget /> in your Admin layout.
4. Deploy and test:
   - POST /api/admin/request-permission
   - POST /api/admin/approve-permission

## Notes
- Ensure your `users/{uid}` docs include `roles` array (e.g., ["owner"], ["genai"]).
- Add Cloud Functions for audit/notifications if you need external channels.
