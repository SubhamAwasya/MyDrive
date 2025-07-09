import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  // console.log(bearerToken);

  if (!bearerToken) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  const token = bearerToken.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Token is not valid." });
  }
};
