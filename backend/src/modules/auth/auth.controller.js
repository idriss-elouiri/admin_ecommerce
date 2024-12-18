import User from "./auth.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";

export const registerHandler = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("تم التسجيل بنجاح");
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "لم يتم العثور على المستخدم"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "كلمة المرور غير صالحة"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'None'
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
