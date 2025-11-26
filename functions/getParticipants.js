import checkAdminAuth from "@/common/checkAdminAuth";

export function onRequest({request, params}) {
    const connection = process.env.CONNECTION_STRING
    if (checkAdminAuth(request)) {
        return new Response(JSON.stringify({
            auth: false
        }), { headers: { "Content-Type": "text/json" } });
    }
    return new Response(JSON.stringify({
        auth: true,
        connection
    }), { headers: { "Content-Type": "text/json" } });
}
