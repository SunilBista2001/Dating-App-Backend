const sendErrToDev = (err, res) => {
  res?.status(err?.statusCode).json({
    status: err?.status,
    error: err,
    message: err?.message,
    stack: err?.stack,
  });
};

const sendErrToProd = (err, res) => {
  if (err.isOperational) {
    res?.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res?.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log(err);
    sendErrToDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    let err = { ...err };
    sendErrToProd(err, res);
  }
};
