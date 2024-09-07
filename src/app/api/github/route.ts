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
    const jsonString = textDecoder.decode(rawBody.value);

    const RawJson = unescape(jsonString)



    const string = JSON.stringify(RawJson);

    // JSON verisini okuyoruz
    const json = JSON.parse(string);



    // Başarılı yanıt dönüyoruz
    return NextResponse.json({ message: 'Webhook processed', payload: json }, { status: 200 });
}