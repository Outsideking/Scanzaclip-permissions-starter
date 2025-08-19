# Cloud Functions (stubs)
Suggested triggers:
- onCreate permission_requests -> create admin notifications, send email/webhook, write audit_logs
- onUpdate permission_requests -> sync status to notifications
- scheduled cleanup for expired permissions_assign.expiresAt
