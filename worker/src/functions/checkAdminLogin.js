import _adminAuth from "../common/_adminAuth.js";

export function onRequest({request, params, env}) {
    if (!_adminAuth(request, env)) {
        return new Response(JSON.stringify({
            auth: false
        }), { headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({
        auth: true
    }), { headers: { "Content-Type": "application/json" } });
}
