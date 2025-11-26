export function onRequest({request, params}) {
    const connection = process.env.CONNECTION_STRING
    return new Response("Hello, world!");
}
