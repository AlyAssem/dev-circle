import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  const tokenSecret = process.env.JWT_SECRET as string;
  return jwt.sign({ id }, tokenSecret, {
    expiresIn: '1h',
  });
};

export default generateToken;
