import hashString from "./hashString.js";

export default function _adminAuth(request, env) {
    const passwordHash = (Object.fromEntries((new URL(request.url)).searchParams) || {}) ['password']
    return !!(passwordHash && (passwordHash === hashString(env.ADMIN_PASSWORD).toString()));

}
