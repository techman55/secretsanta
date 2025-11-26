import hashString from "@/common/hashString";

export default function checkAdminAuth(request) {
    const passwordHash = (Object.fromEntries((new URL(request.url)).searchParams) || {}) ['password']
    return !!(passwordHash && passwordHash === hashString(process.env.ADMIN_PASSWORD));

}
