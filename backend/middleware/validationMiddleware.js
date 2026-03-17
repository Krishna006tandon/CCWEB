const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('student', 'admin').default('student')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// NOTE: price/duration values come as strings from multipart forms — use Joi convert mode
const classSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    duration: Joi.string().required(),
    chefName: Joi.string().required(),
    image: Joi.string().allow('', null).optional(), // optional if file uploaded
}).options({ convert: true, allowUnknown: true });

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().min(0),
    image: Joi.string().allow('', null).optional(),
}).options({ convert: true, allowUnknown: true });

module.exports = {
    registerSchema,
    loginSchema,
    classSchema,
    productSchema,
    validate: (schema) => (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    }
};

