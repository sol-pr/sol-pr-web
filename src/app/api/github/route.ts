import { NextResponse } from "next/server";


export async function GET() {
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}

export async function POST(req: Request) {
    const event = req.headers.get('x-github-event');

    const payload = await req.json();
    return NextResponse.json({ payload }, { status: 200 });
}

