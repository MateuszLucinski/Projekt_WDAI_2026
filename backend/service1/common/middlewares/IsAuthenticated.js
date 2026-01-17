const jwt = require("jsonwebtoken");

exports.check = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Brak nagłówka" });

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token)
    return res.status(401).json({ error: "Błędny token" });

  try {
    const secret = process.env.JWT_SECRET || "tajnehaslo123";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Dostęp zabroniony" });
  }
};
