import { NextResponse } from "next/server";

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

    // Uint8Array'i JSON string'ine dönüştürüyoruz
    const textDecoder = new TextDecoder('utf-8');
    const jsonString = textDecoder.decode(rawBody.value);

    // JSON string'ini JavaScript nesnesine dönüştürüyoruz
    const payload = JSON.parse(jsonString);

    // Payload'dan gerekli bilgileri alıyoruz
    const webhookPayload = {
        pusherName: payload.pusher?.name,
        repositoryUrl: payload.repository?.html_url,
        branch: payload.ref?.split('/').pop(),  // refs/heads/main gibi bir değerden sadece branch ismini alıyoruz
        commitMessage: payload.head_commit?.message,
        commitUrl: payload.head_commit?.url
    };

    // Konsola yazdırıyoruz
    console.log('Webhook Payload:', webhookPayload);

    // Başarılı yanıt dönüyoruz
    return NextResponse.json({ message: 'Webhook processed', payload: webhookPayload }, { status: 200 });
}