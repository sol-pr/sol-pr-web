import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const event = req.headers.get('x-github-event');

    if (event !== 'push') {
        return NextResponse.json({ message: 'Not a push event' }, { status: 400 });
    }

    const payload = await req.json();


    return NextResponse.json({ req: payload, }, { status: 200 });
}