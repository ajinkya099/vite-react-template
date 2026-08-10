import { Hono } from "hono";
import apiApp from "./api";

const app = new Hono<{ Bindings: Env }>();

// Mount API routes
app.route("/api", apiApp);

// Serve React app for all other routes
app.get("/*", (c) => {
  return c.html(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VDR Platform - Secure Virtual Data Room</title>
    <meta name="description" content="Production-grade Virtual Data Room with enterprise security features including dynamic watermarking, NDA management, access control, and detailed analytics." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/react-app/main.tsx"></script>
  </body>
</html>`
  );
});

export default app;
