// Module worker entrypoint for Cloudflare Workers
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Expecting paths like /api/<function>
    const parts = url.pathname.replace(/(^\/|\/$)/g, '').split('/');
    if (parts[0] !== 'api' || !parts[1]) {
      return new Response('Not Found', { status: 404 });
    }

    const fnName = parts[1];

    try {
      const mod = await import(`./functions/${fnName}.js`);
      if (typeof mod.onRequest === 'function') {
        return await mod.onRequest({ request, env, params: {} });
      } else {
        return new Response(JSON.stringify({ error: 'Handler not found' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }
};
