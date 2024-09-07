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

    const textDecoder = new TextDecoder();
    const jsonString = textDecoder.decode(rawBody.value);

    // JSON verisini konsola yazdırıyoruz
    var json = JSON.parse(jsonString);

    // Başarılı yanıt dönüyoruz
    return NextResponse.json({ jsonResponse: json }, { status: 200 });
}