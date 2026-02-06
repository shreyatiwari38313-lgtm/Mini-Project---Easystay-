import jwt from "jsonwebtoken"

const protect = (req, res, next) => {
  const auth = req.headers.authorization

  if (!auth || !auth.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const token = auth.split(" ")[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    // Ensure req.user.id is set from decoded token (handle both '_id' and 'id' fields)
    req.user = {
      ...decoded,
      id: decoded._id || decoded.id,
    }
    next()
  } catch {
    res.status(401).json({ message: "Invalid token" })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" })
  }
  next()
}
//named export
export { protect, isAdmin }
