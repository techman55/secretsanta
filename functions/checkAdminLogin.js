import _adminAuth from "@/common/_adminAuth";

export function onRequest({request, params, env}) {
    console.log()
    if (!_adminAuth(request, env)) {
        return new Response(JSON.stringify({
            auth: false
        }), { headers: { "Content-Type": "text/json" } });
    }
    return new Response(JSON.stringify({
        auth: true
    }), { headers: { "Content-Type": "text/json" } });
}
