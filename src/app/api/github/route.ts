import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const event = req.headers.get('x-github-event');

    if (event !== 'push') {
        return NextResponse.json({ message: 'Not a push event' }, { status: 400 });
    }

    const rawBody = await req.body?.getReader().read();
    if (!rawBody || !rawBody.value) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    // Uint8Array'i JSON string'ine dönüştürüyoruz
    const textDecoder = new TextDecoder('utf-8');
    const jsonString = textDecoder.decode(rawBody.value);

    // JSON string'ini JavaScript nesnesine dönüştürüyoruz
    const payload = JSON.parse(jsonString);


    // Modeli doldurmak için gerekli verileri çekiyoruz
    const webhookPayload: WebhookPayload = {
        pullRequestAuthor: payload.pusher.name,
        repoUrl: payload.repository.html_url,
        isMerged: payload.ref === 'refs/heads/main' || payload.ref === `refs/heads/${payload.repository.default_branch}`,
    };

    // Konsola yazdırıyoruz
    console.log('Webhook Payload:', webhookPayload);

    return NextResponse.json({ message: 'Webhook processed', payload: webhookPayload }, { status: 200 });
}