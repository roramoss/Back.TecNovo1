 import jwt from 'jsonwebtoken';


export const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select(
        'name lastname email _id permissions'
      );

      return next();
    } catch (error) {
      return res.status(401).json({
        response: 'error',
        message: 'No autorizado, el token no es válido',
      });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ response: 'error', message: 'No autorizado, no hay token' });
  }

  return next();
};