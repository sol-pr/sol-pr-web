export class BlinksService {

    async postRequest(url: string) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        return response.json();
    }
}