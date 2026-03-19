const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CateringPackage = require('./models/CateringPackage');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const cateringProducts = [
  {
    name: 'Paneer Tikka',
    description: 'Soft and succulent paneer cubes marinated in aromatic spices and grilled to perfection',
    price: 60,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    stock: 100,
    cookingTime: 30,
    servingSize: 4,
    spiceLevel: 'Medium',
    ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell Peppers', 'Onions'],
    isCateringItem: true,
    dietaryInfo: ['Gluten-free'],
    minOrderQuantity: 4,
    preparationTime: 2,
    requiresAdvance: true,
    advanceNoticeHours: 24
  },
  {
    name: 'Veg Spring Rolls',
    description: 'Crispy vegetable spring rolls served with sweet chili sauce',
    price: 40,
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    stock: 100,
    cookingTime: 20,
    servingSize: 4,
    spiceLevel: 'Low',
    ingredients: ['Spring Roll Sheets', 'Cabbage', 'Carrots', 'Bell Peppers', 'Soy Sauce'],
    isCateringItem: true,
    dietaryInfo: ['Vegan'],
    minOrderQuantity: 4,
    preparationTime: 1,
    requiresAdvance: true,
    advanceNoticeHours: 12
  },
  {
    name: 'Dahi Kebab',
    description: 'Creamy yogurt kebabs with aromatic spices, grilled to golden perfection',
    price: 50,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    stock: 100,
    cookingTime: 25,
    servingSize: 4,
    spiceLevel: 'Low',
    ingredients: ['Yogurt', 'Besan', 'Spices', 'Coriander'],
    isCateringItem: true,
    dietaryInfo: ['Gluten-free', 'Dairy-free'],
    minOrderQuantity: 4,
    preparationTime: 2,
    requiresAdvance: true,
    advanceNoticeHours: 24
  },
  {
    name: 'Mini Samosa',
    description: 'Crispy mini samosas filled with spiced potatoes and peas',
    price: 30,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    stock: 100,
    cookingTime: 15,
    servingSize: 6,
    spiceLevel: 'Medium',
    ingredients: ['Potatoes', 'Peas', 'Spices', 'Flour', 'Oil'],
    isCateringItem: true,
    dietaryInfo: ['Vegan'],
    minOrderQuantity: 6,
    preparationTime: 1,
    requiresAdvance: true,
    advanceNoticeHours: 12
  },
  {
    name: 'Fruit Punch',
    description: 'Refreshing fruit punch with fresh seasonal fruits',
    price: 40,
    category: 'Beverage',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    stock: 100,
    cookingTime: 10,
    servingSize: 2,
    spiceLevel: 'Low',
    ingredients: ['Mixed Fruits', 'Orange Juice', 'Lemon', 'Mint', 'Sugar'],
    isCateringItem: true,
    dietaryInfo: ['Vegan', 'Gluten-free'],
    minOrderQuantity: 2,
    preparationTime: 0.5,
    requiresAdvance: false,
    advanceNoticeHours: 6
  },
  {
    name: 'Masala Lemonade',
    description: 'Tangy lemonade with Indian spices and herbs',
    price: 35,
    category: 'Beverage',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    stock: 100,
    cookingTime: 5,
    servingSize: 2,
    spiceLevel: 'Medium',
    ingredients: ['Lemon', 'Water', 'Sugar', 'Cumin Powder', 'Mint'],
    isCateringItem: true,
    dietaryInfo: ['Vegan', 'Gluten-free'],
    minOrderQuantity: 2,
    preparationTime: 0.5,
    requiresAdvance: false,
    advanceNoticeHours: 6
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft and spongy milk solids dumplings soaked in rose flavored sugar syrup',
    price: 25,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
    stock: 100,
    cookingTime: 30,
    servingSize: 4,
    spiceLevel: 'Low',
    ingredients: ['Milk Powder', 'Flour', 'Sugar', 'Rose Water', 'Cardamom'],
    isCateringItem: true,
    dietaryInfo: [],
    minOrderQuantity: 4,
    preparationTime: 2,
    requiresAdvance: true,
    advanceNoticeHours: 24
  },
  {
    name: 'Rasmalai',
    description: 'Soft cottage cheese dumplings in creamy milk flavored with cardamom and saffron',
    price: 35,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
    stock: 100,
    cookingTime: 45,
    servingSize: 4,
    spiceLevel: 'Low',
    ingredients: ['Cottage Cheese', 'Milk', 'Sugar', 'Cardamom', 'Saffron'],
    isCateringItem: true,
    dietaryInfo: [],
    minOrderQuantity: 4,
    preparationTime: 3,
    requiresAdvance: true,
    advanceNoticeHours: 24
  }
];

const seedKittyPartyPackage = async () => {
  try {
    await connectDB();
    
    console.log('Creating catering products...');
    for (const productData of cateringProducts) {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        console.log(`Created product: ${productData.name}`);
      } else {
        console.log(`Product already exists: ${productData.name}`);
      }
    }
    
    // Get product IDs
    const products = await Product.find({ name: { $in: cateringProducts.map(p => p.name) } });
    const productMap = {};
    products.forEach(product => {
      productMap[product.name] = product._id;
    });
    
    const kittyPartyPackage = {
      name: 'Kitty Party Special',
      description: 'Perfect package for intimate kitty parties with delicious vegetarian snacks and beverages. Includes everything needed for a memorable gathering.',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
      packageType: 'Silver',
      pricePerPerson: 450,
      minGuests: 10,
      maxGuests: 25,
      items: [
        {
          productId: productMap['Paneer Tikka'],
          name: 'Paneer Tikka',
          category: 'Appetizers',
          quantity: 4,
          unit: 'Pieces'
        },
        {
          productId: productMap['Veg Spring Rolls'],
          name: 'Veg Spring Rolls',
          category: 'Appetizers',
          quantity: 2,
          unit: 'Pieces'
        },
        {
          productId: productMap['Dahi Kebab'],
          name: 'Dahi Kebab',
          category: 'Appetizers',
          quantity: 2,
          unit: 'Pieces'
        },
        {
          productId: productMap['Mini Samosa'],
          name: 'Mini Samosa',
          category: 'Appetizers',
          quantity: 3,
          unit: 'Pieces'
        },
        {
          productId: productMap['Fruit Punch'],
          name: 'Fruit Punch',
          category: 'Beverages',
          quantity: 2,
          unit: 'Glasses'
        },
        {
          productId: productMap['Masala Lemonade'],
          name: 'Masala Lemonade',
          category: 'Beverages',
          quantity: 2,
          unit: 'Glasses'
        },
        {
          productId: productMap['Gulab Jamun'],
          name: 'Gulab Jamun',
          category: 'Desserts',
          quantity: 2,
          unit: 'Pieces'
        },
        {
          productId: productMap['Rasmalai'],
          name: 'Rasmalai',
          category: 'Desserts',
          quantity: 1,
          unit: 'Pieces'
        }
      ],
      inclusions: [
        'Appetizers',
        'Beverages',
        'Desserts',
        'Service Staff',
        'Cutlery & Crockery',
        'Cleaning Service'
      ],
      dietaryOptions: ['Veg'],
      servingStyle: 'Cocktail',
      preparationTime: 4,
      advanceNoticeHours: 24,
      isPopular: true,
      isActive: true,
      customizations: {
        canModifyItems: true,
        canAddItems: true,
        maxCustomItems: 3
      }
    };
    
    console.log('Checking if Kitty Party Special package already exists...');
    const existingPackage = await CateringPackage.findOne({ name: 'Kitty Party Special' });
    
    if (existingPackage) {
      console.log('Kitty Party Special package already exists. Updating...');
      await CateringPackage.updateOne({ name: 'Kitty Party Special' }, kittyPartyPackage);
      console.log('Package updated successfully!');
    } else {
      console.log('Creating new Kitty Party Special package...');
      const newPackage = new CateringPackage(kittyPartyPackage);
      await newPackage.save();
      console.log('Package created successfully!');
    }
    
    // Display the created package
    const package = await CateringPackage.findOne({ name: 'Kitty Party Special' });
    console.log('\n=== Kitty Party Special Package ===');
    console.log(`Name: ${package.name}`);
    console.log(`Price: ₹${package.pricePerPerson} per person`);
    console.log(`Guests: ${package.minGuests} - ${package.maxGuests} people`);
    console.log(`Serving Style: ${package.servingStyle}`);
    console.log(`Items: ${package.items.length} varieties`);
    console.log(`Inclusions: ${package.inclusions.join(', ')}`);
    console.log('\nMenu Items:');
    package.items.forEach(item => {
      console.log(`- ${item.name} (${item.quantity} ${item.unit} per person)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding kitty party package:', error);
    process.exit(1);
  }
};

seedKittyPartyPackage();
