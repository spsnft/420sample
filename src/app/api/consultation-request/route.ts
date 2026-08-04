import { NextRequest, NextResponse } from 'next/server';

// Notifies staff about a free-consultation request from the landing page.
//
// LINE Notify was shut down by LINE in March 2025 — this uses the official
// replacement, the LINE Messaging API's push endpoint, sending a message
// from the business's official LINE account to a staff user/group.
const LINE_PUSH_URL = 'https://api.line.me/v2/bot/message/push';

const MAX_NAME_LENGTH = 100;
const PHONE_PATTERN = /^[0-9+()\-\s]{6,20}$/;

export async function POST(req: NextRequest) {
  let body: { name?: unknown; phone?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

  if (!name || name.length > MAX_NAME_LENGTH || !phone || !PHONE_PATTERN.test(phone)) {
    return NextResponse.json({ error: 'Invalid name or phone' }, { status: 400 });
  }

  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const staffUserId = process.env.LINE_STAFF_USER_ID;

  if (!channelAccessToken || !staffUserId) {
    console.error('Consultation request received but LINE Messaging API is not configured (missing LINE_CHANNEL_ACCESS_TOKEN / LINE_STAFF_USER_ID)');
    return NextResponse.json({ error: 'Consultation requests are not available right now' }, { status: 503 });
  }

  const text = `New free consultation request\nName: ${name}\nPhone: ${phone}`;

  try {
    const lineRes = await fetch(LINE_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to: staffUserId,
        messages: [{ type: 'text', text }],
      }),
    });

    if (!lineRes.ok) {
      console.error('LINE Messaging API push failed', lineRes.status, await lineRes.text());
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 502 });
    }
  } catch (err) {
    console.error('LINE Messaging API push error', err);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
