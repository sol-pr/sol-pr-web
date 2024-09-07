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

    const payload = convertToJson(unescapedJsonString);

    // Başarılı yanıt dönüyoruz
    return NextResponse.json({ message: 'Webhook processed', payload }, { status: 200 });
}


function convertToJson(unescapedJsonString: string): any {
    // Step 1: Escape the string to convert it into a valid JSON string
    const escapedJsonString = unescapedJsonString.replace(/\\\"/g, '\"');

    // Step 2: Parse the valid JSON string into a JSON object
    const jsonObject = JSON.parse(escapedJsonString);

    return jsonObject;
}
