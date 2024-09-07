import { NextResponse } from "next/server";
import { unescape } from "querystring";

export async function POST(req: Request) {
    const event = req.headers.get('x-github-event');

    // Sadece 'push' eventlerini işliyoruz
    if (event !== 'push') {
        return NextResponse.json({ message: 'Not a push event' }, { status: 400 });
    }

    // req.body'den gelen veriyi okuyup Uint8Array'e dönüştürüyoruz
    const rawBody = await req.body?.getReader().read();
    if (!rawBody || !rawBody.value) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const textDecoder = new TextDecoder();
    const escapedJsonString = textDecoder.decode(rawBody.value);
    const unescapedJsonString = decodeURIComponent(escapedJsonString);

    const stringText = unescape(unescapedJsonString);
    const convert = stringText.replace("payload=", "");
    const payload = JSON.parse(convert);

    const webhookPayload: WebhookPayload = {
        pullRequestAuthor: payload.pusher.name,
        repoUrl: payload.repository.html_url,
        isMerged: payload.ref === 'refs/heads/main' || payload.ref === `refs/heads/${payload.repository.default_branch}`,
    };
    // Başarılı yanıt dönüyoruz
    return NextResponse.json({ message: 'Webhook processed', webhookPayload }, { status: 200 });
}
