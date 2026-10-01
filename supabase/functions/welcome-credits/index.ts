// POST with the user's JWT, after login. Deposits the free starting credits once per account.
import { admin, adjustCredits, json, requireUser, serve, WELCOME_CREDITS } from '../_shared/server.ts';

serve(async req => {
  const user = await requireUser(req);
  // The conditional update is the once-only guard; the idempotency key covers a retried request.
  const { data } = await admin.from('profiles').update({ welcome_granted: true })
    .eq('id', user.id).eq('welcome_granted', false).select('id');
  if (!data?.length) return json(200, { granted: false });

  try {
    await adjustCredits(user.id, WELCOME_CREDITS, `welcome-${user.id}`);
  } catch (error) {
    await admin.from('profiles').update({ welcome_granted: false }).eq('id', user.id);
    throw error;
  }
  return json(200, { granted: true });
});
