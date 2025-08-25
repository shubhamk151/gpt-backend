import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
  if (!token)
    return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // attach user info
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
