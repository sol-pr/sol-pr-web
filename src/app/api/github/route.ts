import { NextResponse } from "next/server";


export async function GET() {
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}

export async function POST(req: Request) {
    const event = req.headers.get('x-github-event');

    if (event !== 'push') {
        return NextResponse.json({ message: 'Not a push event' }, { status: 400 });
    }

    const payload = await req.json();

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
