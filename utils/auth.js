import jwt from "jsonwebtoken";
// generate jwt token
const generateToken = (userId) => {
    // jwt.sign() creates a token
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateToken;