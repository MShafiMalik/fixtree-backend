import { registerAs } from '@nestjs/config';

export default registerAs('google', () => {
  const raw = process.env.GOOGLE_CLIENT_ID ?? '';
  const clientIds = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    clientId: clientIds[0] ?? undefined,
    clientIds: clientIds.length > 0 ? clientIds : undefined,
  };
});
