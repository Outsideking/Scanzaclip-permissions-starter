// pages/api/admin/approve-permission.js
import { db, admin } from '../../../lib/firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { reqId, approverUid, action, note = '', expireDays = null } = req.body || {};
    if (!reqId || !approverUid || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const reqRef = db.collection('permission_requests').doc(reqId);
    const snap = await reqRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Request not found' });
    const data = snap.data();

    const now = admin.firestore.FieldValue.serverTimestamp();
    const status = action === 'approve' ? 'approved' : action === 'deny' ? 'denied' : 'needs_info';

    await reqRef.update({
      status,
      approverUid,
      updatedAt: now,
      history: admin.firestore.FieldValue.arrayUnion({ by: approverUid, action, note, at: now }),
    });

    if (action === 'approve') {
      const expiresAt = expireDays
        ? admin.firestore.Timestamp.fromMillis(Date.now() + expireDays * 24 * 3600 * 1000)
        : null;
      await db.collection('permissions_assign').add({
        principal: data.requesterUid,
        role: 'custom',
        resource: data.targetResource,
        grantedBy: approverUid,
        grantedAt: now,
        expiresAt,
      });
    }

    await db.collection('notifications').add({
      toUid: data.requesterUid,
      title: status === 'approved' ? 'Permission approved' : status === 'denied' ? 'Permission denied' : 'Need more info',
      body: note,
      relatedRequestId: reqId,
      createdAt: now,
    });

    await db.collection('audit_logs').add({
      action: action === 'approve' ? 'approve_request' : action === 'deny' ? 'deny_request' : 'ask_info',
      actor: approverUid,
      requestId: reqId,
      details: note,
      timestamp: now,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
