interface WebhookPayload {
    id: string
    pullRequestAuthor: string;
    repoUrl: string;
    isMerged: boolean;
}
