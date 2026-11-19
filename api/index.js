import app from "../server.js";

export default function handler(req, res) {
  // Gracefully handle root URL so opening https://...vercel.app in a browser always succeeds
  if (!req.url || req.url === "/" || req.url === "/api" || req.url === "/api/") {
    return res.status(200).json({
      success: true,
      message: "FandomVerse Backend API is Live on Vercel!",
      status: "online",
      endpoints: {
        health: "/api/health",
        content: "/api/content",
        events: "/api/events",
        shop: "/api/shop/overview",
        auth: "/api/auth/login",
      },
    });
  }

  return app(req, res);
}
