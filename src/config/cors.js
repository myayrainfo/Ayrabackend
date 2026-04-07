import env from "./env.js";

function expandLocalOriginAliases(origin) {
  if (!origin) {
    return [];
  }

  return Array.from(
    new Set([
      origin,
      origin.replace("://localhost", "://127.0.0.1"),
      origin.replace("://127.0.0.1", "://localhost"),
    ]),
  );
}

export const allowedOrigins = Array.from(
  new Set(
    [
      env.frontendUrl,
      ...env.corsOrigins,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
      "http://localhost:5175",
      "http://127.0.0.1:5175",
      "http://localhost:5176",
      "http://127.0.0.1:5176",
      "http://localhost:5177",
      "http://127.0.0.1:5177",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://superadmin.myayra.in",
      "https://user.myayra.in",
      "https://master.myayra.in",
      "https://myayra.in",
    ]
      .filter(Boolean)
      .flatMap(expandLocalOriginAliases),
  ),
);

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

export default corsOptions;


