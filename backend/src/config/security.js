import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";

export function applySecurity(app, allowedOrigin) {
  // Disable fingerprinting
  app.disable("x-powered-by");

  // Helmet CSP
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        connectSrc: [
          "'self'",
          allowedOrigin,
          "https://your-api-id.execute-api.region.amazonaws.com"
        ],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    })
  );

  // CORS
  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "x-webhook-secret", "x-signature", "x-timestamp"]
    })
  );

  // JSON body parser with raw body capture for HMAC verification
  app.use(
    bodyParser.json({
      limit: "100kb",
      verify: (req, res, buf) => {
        req.rawBody = buf.toString("utf8");
      }
    })
  );
}
