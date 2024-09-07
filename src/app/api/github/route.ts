import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const event = req.headers.get('x-github-event');

    if (event !== 'push') {
        return NextResponse.json({ message: 'Not a push event' }, { status: 400 });
    }



    return NextResponse.json({ req: req, }, { status: 200 });
}