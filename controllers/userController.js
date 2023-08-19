const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.handelLogin = async (req, res, next) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error('کاربری با این ایمیل یافت نشد')
            error.statusCode = 404;
            throw error
        }

        const isEqual = await bcrypt.compare(password, user.password)

        if (isEqual) {
            const token = jwt.sign({
                user: {
                    userId: user._id.toString(),
                    email: user.email,
                    fullname: user.fullname
                }
            }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.status(200).json({ token, userId: user._id.toString() })

        } else {
            const error = new Error('کاربری با این ایمیل یافت نشد')
            error.statusCode = 422;
            throw error
        }

    } catch (error) {
        next(error)
    }

}


exports.createUser = async (req, res, next) => {
    const errors = [];

    try {
        await User.userValidation(req.body);
        const { fullname, email, password } = req.body
        const user = await User.findOne({ email });
        if (user) {
            const error = new Error(
                "کاربری با این ایمیل در پایگاه داده موجود است"
            );
            error.statusCode = 422;
            throw error;
        } else {
            await User.create({ fullname, email, password });

            //? Send Welcome Email
            sendEmail(
                email,
                fullname,
                "خوش آمدی به وبلاگ ما",
                "خیلی خوشحالیم که به جمع ما وبلاگرهای خفن ملحق شدی"
            );

            res.status(201).json({ message: "عضویت موفقیت آمیز بود" });
        }

    } catch (error) {
        next(err);
    }
}

exports.handleForgetPassword = async (req, res, next) => {

    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            const error = new Error("کاربری با ایمیل در پایگاه داده ثبت نشده");
            error.statusCode = 404;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const resetLink = `http://localhost:${process.env.PORT}/users/reset-password/${token}`;

        sendEmail(
            user.email,
            user.fullname,
            "فراموشی رمز عبور",
            `جهت تغییر رمز عبور فعلی رو لینک زیر کلیک کنید
            <a href="${resetLink}">لینک تغییر رمز عبور</a>`
        );

        res.status(200).json({
            message: "لینک ریست کلمه عبور با موفقیت ارسال شد",
        });

    } catch (error) {
        next(error)
    }

};

exports.handleResetPassword = async (req, res, next) => {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            const error = new Error("شما مجوز این عملیات را ندارید");
            error.statusCode = 401;
            throw error;
        }

        if (password !== confirmPassword) {
            const error = new Error("کلمه های عبور یکسان نمی باشند");
            error.statusCode = 422;
            throw error;
        }

        const user = await User.findOne({ _id: decodedToken.userId });

        if (!user) {
            const error = new Error(
                "کاربری با این شناسه در پایگاه داده یافت نشد"
            );
            error.statusCode = 404;
            throw error;
        }

        user.password = password;
        await user.save();

        res.status(200).json({ message: "عملیات با موفقیت انجام شد" });
    } catch (err) {
        next(err);
    }
};
