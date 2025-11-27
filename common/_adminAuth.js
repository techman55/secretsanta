import hashString from "@/common/hashString";


export default function _adminAuth(request, env) {
    const passwordHash = (Object.fromEntries((new URL(request.url)).searchParams) || {}) ['password']
    console.log(passwordHash)
    console.log(env)
    console.log(hashString(env.ADMIN_PASSWORD).toString())
    return !!(passwordHash && (passwordHash === hashString(env.ADMIN_PASSWORD).toString()));

}
