const Joi = require('joi');

const signupSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('client', 'expert', 'admin').default('client'),
    skills: Joi.array().items(Joi.string()).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const verifyLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required()
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
});

module.exports = {
    signupSchema,
    loginSchema,
    verifyLoginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
};
