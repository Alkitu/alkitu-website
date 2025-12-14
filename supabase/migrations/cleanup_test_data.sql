-- Delete sessions created during testing
DELETE FROM sessions WHERE session_fingerprint LIKE 'test-%';
