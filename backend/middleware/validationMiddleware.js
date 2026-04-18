const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('student', 'admin').default('student')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
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
    category: Joi.string().valid('Veg', 'Non-veg', 'Chinese', 'Italian', 'Continental', 'Dessert', 'Beverage').required(),
    cookingTime: Joi.number().required().min(1),
    servingSize: Joi.number().required().min(1),
    spiceLevel: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
    ingredients: Joi.array().items(Joi.string()),
    allergens: Joi.array().items(Joi.string()),
    dietaryInfo: Joi.array().items(Joi.string().valid('Gluten-free', 'Vegan', 'Jain', 'Dairy-free', 'Nut-free')),
    isCateringItem: Joi.boolean().default(false),
    minOrderQuantity: Joi.number().default(1),
    preparationTime: Joi.number(),
    requiresAdvance: Joi.boolean().default(false),
    advanceNoticeHours: Joi.number().default(24),
    stock: Joi.number().default(0),
    image: Joi.string().allow('', null).optional(),
}).options({ convert: true, allowUnknown: true });

const cateringPackageSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    packageType: Joi.string().valid('Silver', 'Gold', 'Platinum', 'Custom').required(),
    pricePerPerson: Joi.number().required().min(0),
    minGuests: Joi.number().required().min(1),
    maxGuests: Joi.number().required().min(Joi.ref('minGuests')),
    servingStyle: Joi.string().valid('Buffet', 'Plated', 'Cocktail', 'Family Style').default('Buffet'),
    preparationTime: Joi.number().required().min(1),
    advanceNoticeHours: Joi.number().required().min(1),
    isPopular: Joi.boolean().default(false),
    isActive: Joi.boolean().default(true),
    items: Joi.array().items(Joi.object({
        productId: Joi.string().required(),
        name: Joi.string().required(),
        category: Joi.string().required(),
        quantity: Joi.number().required().min(1),
        unit: Joi.string().valid('Pieces', 'Plates', 'Bowls', 'Glasses', 'Servings').default('Plates')
    })),
    inclusions: Joi.array().items(Joi.string().valid(
        'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Service Staff',
        'Tables & Chairs', 'Decorations', 'Cutlery & Crockery', 'Cleaning Service', 'Transportation'
    )),
    dietaryOptions: Joi.array().items(Joi.string().valid('Veg', 'Non-veg', 'Jain', 'Vegan', 'Gluten-free')),
    image: Joi.string().allow('', null).optional(),
}).options({ convert: true, allowUnknown: true });

const cateringOrderSchema = Joi.object({
    eventType: Joi.string().valid('Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Engagement', 'Other').required(),
    eventDate: Joi.date().min('now').required(),
    eventTime: Joi.string().required(),
    venue: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        landmark: Joi.string().optional(),
        contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required()
    }).required(),
    guestCount: Joi.number().required().min(10),
    servingStyle: Joi.string().valid('Buffet', 'Plated', 'Cocktail', 'Family Style').default('Buffet'),
    items: Joi.array().items(Joi.object({
        productId: Joi.string().optional(),
        name: Joi.string().required(),
        quantity: Joi.number().required().min(1),
        price: Joi.number().optional().min(0),
        isCustomItem: Joi.boolean().default(false),
        dietary: Joi.string().valid('vegetarian', 'vegan', 'jain').default('vegetarian'),
        customizations: Joi.object({
            spiceLevel: Joi.string().valid('Low', 'Medium', 'High'),
            specialInstructions: Joi.string()
        })
    })),
    packages: Joi.array().items(Joi.object({
        packageId: Joi.string(),
        name: Joi.string(),
        quantity: Joi.number().min(1),
        price: Joi.number().min(0)
    })),
    specialRequirements: Joi.string().optional(),
}).options({ convert: true, allowUnknown: true });

module.exports = {
    registerSchema,
    loginSchema,
    classSchema,
    productSchema,
    cateringPackageSchema,
    cateringOrderSchema,
    validate: (schema) => (req, res, next) => {
        console.log('--- 🛑 VALIDATION CHECK ---');
        console.log('📦 req.body arrived as:', req.body);
        if (req.file) console.log('📄 req.file arrived as:', req.file);
        const { error } = schema.validate(req.body);
        if (error) {
            console.error('❌ Validation Failed:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }
        console.log('✅ Validation Passed. Moving to controller.');
        next();
    }
};

