// components/PermissionChatWidget.jsx
"use client";
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';
import Link from 'next/link';

export default function PermissionChatWidget(){
  const [notifs, setNotifs] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(() => setReady(true));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!ready || !auth.currentUser) return;
    const q = query(collection(db, 'notifications'), where('toUid', '==', auth.currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setNotifs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [ready]);

  const quickReply = async (notif, action) => {
    if (!notif.relatedRequestId) return;
    await fetch('/api/admin/approve-permission', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reqId: notif.relatedRequestId, approverUid: auth.currentUser.uid, action })
    });
  };

  return (
    <div style={{position:'fixed', bottom:16, right:16, width:320}} className="bg-white border rounded shadow p-3 text-sm">
      <div className="font-semibold mb-2">Notifications</div>
      <div className="space-y-2" style={{maxHeight:300, overflow:'auto'}}>
        {notifs.length === 0 && <div className="text-gray-500">No notifications</div>}
        {notifs.map(n => (
          <div key={n.id} className="border rounded p-2">
            <div className="font-medium">{n.title}</div>
            <div className="text-gray-600 text-xs">{n.body}</div>
            {n.relatedRequestId && (
              <div className="flex gap-2 mt-2">
                <button onClick={()=>quickReply(n,'approve')} className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={()=>quickReply(n,'deny')} className="px-2 py-1 bg-red-600 text-white rounded">Deny</button>
                <Link href={`/admin/requests/${n.relatedRequestId}`} className="px-2 py-1 bg-gray-200 rounded">Open</Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
