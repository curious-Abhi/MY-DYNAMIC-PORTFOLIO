


  // Helper function to generate token
const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  res.status(statusCode).cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
  }).json({
    success: true,
    message,
    user,
    token,
  });
};





/*export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    res
      .status(statusCode)
      .cookie("token", token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  };

  */
