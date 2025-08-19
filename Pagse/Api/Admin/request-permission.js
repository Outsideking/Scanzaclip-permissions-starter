// pages/api/admin/request-permission.js
import { db, admin } from '../../../lib/firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const {
      uid,
      requesterName,
      targetResource,
      requestedPermissions = [],
      message = '',
      language = 'th',
    } = req.body || {};

    if (!uid || !requesterName || !targetResource) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const doc = {
      requesterUid: uid,
      requesterName,
      targetResource,
      requestedPermissions,
      message,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      language,
      history: [{ by: uid, action: 'created', at: now }],
    };

    const ref = await db.collection('permission_requests').add(doc);

    await db.collection('notifications').add({
      toRole: 'admin',
      toUid: null,
      title: 'New permission request',
      body: `${requesterName} requested ${requestedPermissions.join(', ')}`,
      relatedRequestId: ref.id,
      createdAt: now,
    });

    return res.status(200).json({ ok: true, id: ref.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
