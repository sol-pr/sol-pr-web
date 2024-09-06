export class GitGubServices {
    async getRepos() {
        const response = await fetch('https://api.github.com/users/bgraokmush/repos');
        console.log(response);
        return response.json();

    }
}