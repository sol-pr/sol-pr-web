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

    const textDecoder = new TextDecoder('utf-8');
    const jsonString = textDecoder.decode(rawBody.value);

    // Başarılı yanıt dönüyoruz
    return NextResponse.json({ message: 'Webhook processed', jsonResponse: jsonString }, { status: 200 });
}