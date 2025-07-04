import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Effect, flow } from "effect";
import { ShareChatRequest, ShareChatResponse, ClearMessagesRequest, ClearMessagesResponse, VideoSearchRequest, VideoSearchResponse } from "@/lib/services/schema";

export class Api extends Effect.Service<Api>()("Api", {
    dependencies: [FetchHttpClient.layer],
    effect: Effect.gen(function* () {
        const baseClient = yield* HttpClient.HttpClient;
        const client = baseClient.pipe(
            HttpClient.mapRequest(
                flow(
                    HttpClientRequest.prependUrl(`/api`),
                    HttpClientRequest.acceptJson
                )
            )
        );
        
        const externalClient = baseClient.pipe(
            HttpClient.mapRequest(HttpClientRequest.acceptJson)
        );

        return {
            createShareVideo: (body: ShareChatRequest) =>
                HttpClientRequest.schemaBodyJson(ShareChatRequest)
                (HttpClientRequest.post("/share"), body).pipe(
                    Effect.flatMap(client.execute),
                    Effect.flatMap(HttpClientResponse.schemaBodyJson(ShareChatResponse)),
                    Effect.scoped
                ),
            clearMessages: (body: ClearMessagesRequest) =>
                HttpClientRequest.schemaBodyJson(ClearMessagesRequest)
                (HttpClientRequest.post("/clear-messages"), body).pipe(
                    Effect.flatMap(client.execute),
                    Effect.flatMap(HttpClientResponse.schemaBodyJson(ClearMessagesResponse)),
                    Effect.scoped
                ),
            searchVideos: (query: string) =>
                externalClient.execute(
                    HttpClientRequest.get(`https://api.ahmadrosid.com/youtube/search?q=${encodeURIComponent(query)}`)
                ).pipe(
                    Effect.flatMap(HttpClientResponse.schemaBodyJson(VideoSearchResponse)),
                    Effect.scoped
                )
        };
    }),
}) { }

export const createShareVideo = (
    input: ShareChatRequest
) => Effect.gen(function* () {
    const api = yield* Api;
    return yield* api.createShareVideo(input);
});

export const clearChatMessages = (
    input: ClearMessagesRequest
) => Effect.gen(function* () {
    const api = yield* Api;
    return yield* api.clearMessages(input);
});

export const searchVideos = (
    query: string
) => Effect.gen(function* () {
    const api = yield* Api;
    return yield* api.searchVideos(query);
});
