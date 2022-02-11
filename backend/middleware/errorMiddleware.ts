const notFound = (req: any, res: any, next: any) => {
  console.log('NOT FOUND ERROR');
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    errorMessage: err.message,
  });
};

export { notFound, errorHandler };
