import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData = require('form-data');

const BASE_URL = 'http://localhost:5000';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASS = '123456';

const DUMMY_IMAGE_PATH = path.join(__dirname, 'dummy.jpg');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function seed() {
  try {
    console.log('🚀 Starting Seeding Process...');

    // 1. Login
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${BASE_URL}/admin/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASS
    });
    const token = loginRes.data.access_token;
    console.log('✅ Login successful!');

    const authHeader = { Authorization: `Bearer ${token}` };

    // 2. Create Categories & Subcategories
    console.log('📁 Creating Categories & Subcategories...');
    const dataModels = [
      { name: "Men's Tops", subs: ["Formal Shirts", "Casual Shirts", "Polo Shirts", "Graphic Tees"] },
      { name: "Men's Bottoms", subs: ["Denim Jeans", "Slim-Fit Chinos", "Formal Trousers", "Cargo Shorts"] },
      { name: "Women's Dresses", subs: ["Maxi Dresses", "Cocktail Dresses", "Summer Sundresses", "Evening Gowns"] },
      { name: "Women's Wear", subs: ["Silk Blouses", "Pencil Skirts", "Knitted Cardigans"] },
      { name: "Footwear", subs: ["Leather Boots", "Canvas Sneakers", "Formal Oxfords", "Sport Runners"] },
      { name: "Watches", subs: ["Automatic Luxury", "Digital Sport", "Minimalist Analog"] },
      { name: "Jewelry", subs: ["Gold Bracelets", "Silver Necklaces", "Diamond Earrings"] },
      { name: "Outerwear", subs: ["Leather Jackets", "Denim Jackets", "Winter Overcoats", "Windbreakers"] },
      { name: "Activewear", subs: ["Training Hoodies", "Joggers", "Compression Tights"] },
      { name: "Accessories", subs: ["Leather Belts", "Classic Wallets", "Silk Ties", "Sun Hats"] },
      { name: "Traditional Wear", subs: ["Luxury Sarees", "Embroidered Kurtas", "Classic Panjabis"] },
      { name: "Kid's Collection", subs: ["Baby Bodysuits", "Toddler Sets", "School Wear"] }
    ];

    const categories: any[] = [];
    const subcategories: any[] = [];

    for (const cat of dataModels) {
      try {
        const form = new FormData();
        form.append('name', cat.name);
        form.append('description', `Quality collection of ${cat.name}`);
        form.append('image', fs.createReadStream(DUMMY_IMAGE_PATH));

        const res = await axios.post(`${BASE_URL}/category`, form, {
          headers: { ...authHeader, ...form.getHeaders() }
        });
        const category = res.data.data;
        categories.push(category);
        console.log(`   - Category Created: ${cat.name}`);
        await sleep(200);
      } catch (err: any) {
        if (err.response?.status === 409) {
          console.log(`   - Category already exists: ${cat.name}`);
          const existing = await axios.get(`${BASE_URL}/category?limit=100`, { headers: authHeader });
          const found = existing.data.data.find((c: any) => c.name === cat.name);
          if (found) categories.push(found);
        } else {
            console.error(`   - Error creating category ${cat.name}:`, err.message);
        }
      }

      const currentCategory = categories[categories.length - 1];
      if (!currentCategory) continue;

      for (const subName of cat.subs) {
        try {
            const subForm = new FormData();
            subForm.append('name', subName);
            subForm.append('categoryId', currentCategory.id);
            subForm.append('description', `Explore our ${subName} catalog`);
            subForm.append('image', fs.createReadStream(DUMMY_IMAGE_PATH));

            const subRes = await axios.post(`${BASE_URL}/subcategory`, subForm, {
            headers: { ...authHeader, ...subForm.getHeaders() }
            });
            subcategories.push(subRes.data.data);
            console.log(`     > Subcategory Created: ${subName}`);
            await sleep(200);
        } catch (err: any) {
            if (err.response?.status === 409) {
                console.log(`     > Subcategory already exists: ${subName}`);
                const existing = await axios.get(`${BASE_URL}/subcategory?limit=1000`, { headers: authHeader });
                const found = existing.data.data.find((s: any) => s.name === subName);
                if (found) subcategories.push(found);
            } else {
                console.log(`     > Error creating subcategory ${subName}:`, err.message);
            }
        }
      }
    }

    // 3. Create Colors
    console.log('🎨 Creating Colors...');
    const colorNames = [
      "Obsidian Black", "Arctic White", "Crimson Red", "Royal Blue", 
      "Emerald Green", "Pastel Pink", "Mustard Yellow", "Charcoal Gray", 
      "Burgundy", "Navy Blue", "Olive Green", "Rose Gold"
    ];
    const colors: any[] = [];
    for (const name of colorNames) {
        try {
            const colorForm = new FormData();
            colorForm.append('name', name);
            colorForm.append('description', `The elegant ${name} shade`);
            colorForm.append('image', fs.createReadStream(DUMMY_IMAGE_PATH));
            
            const res = await axios.post(`${BASE_URL}/color`, colorForm, {
                headers: { ...authHeader, ...colorForm.getHeaders() }
            });
            colors.push(res.data.data);
            console.log(`   🎨 Color Created: ${name}`);
            await sleep(100);
        } catch (err: any) {
            if (err.response?.status === 409) {
                console.log(`   - Color already exists: ${name}`);
                const existing = await axios.get(`${BASE_URL}/color?limit=100`, { headers: authHeader });
                const found = existing.data.data.find((c: any) => c.name === name);
                if (found) colors.push(found);
            }
        }
    }
    console.log(`✅ ${colors.length} Colors Created.`);

    // 4. Create Sizes
    console.log('📏 Creating Sizes...');
    const sizeNames = ["S", "M", "L", "XL", "XXL"];
    const sizes: any[] = [];
    for (const name of sizeNames) {
        const sizeForm = new FormData();
        sizeForm.append('name', name);
        sizeForm.append('image', fs.createReadStream(DUMMY_IMAGE_PATH));
        
        const res = await axios.post(`${BASE_URL}/size`, sizeForm, {
            headers: { ...authHeader, ...sizeForm.getHeaders() }
        });
        sizes.push(res.data.data);
    }
    console.log(`✅ ${sizes.length} Sizes Created.`);

    // 5. Create Products
    console.log('👕 Creating Products...');
    const productNames = [
        "Premium Leather Jacket", "Slim Fit Denim Jeans", "Summer Floral Maxi", 
        "Classic Polo Shirt", "Automatic Chronograph Watch", "Genuine Leather Wallet",
        "Athletic Training Runners", "Formal Silk Tie", "Designer Evening Gown",
        "Vintage Denim Jacket", "Cashmere Overcoat", "Smart Casual Chinos",
        "Bohemian Lace Blouse", "Minimalist Gold Bracelet", "Rugged Trekking Boots",
        "Water-Resistant Windbreaker", "Luxury Silk Saree", "Cotton Baby Onesie",
        "Graphic Streetwear Tee", "Professional Formal Trousers", "Sleek Digital Sport Watch",
        "Elegant Pearl Necklace", "High-Performance Joggers", "Sophisticated Pencil Skirt",
        "Comfortable Canvas Sneakers", "Warm Knitted Cardigan", "Timeless Formal Oxford",
        "Trendy Cargo Shorts", "Chic Cocktail Dress", "Durable School Uniform"
    ];

    for (let i = 0; i < productNames.length; i++) {
        const name = productNames[i];
        const sub = subcategories[Math.floor(Math.random() * subcategories.length)];
        const categoryId = sub.category?.id || sub.categoryId || categories[Math.floor(Math.random() * categories.length)].id;
        
        const prodColors = [colors[Math.floor(Math.random() * colors.length)].id];
        if (Math.random() > 0.5) prodColors.push(colors[Math.floor(Math.random() * colors.length)].id);
        
        const prodSizes = [sizes[Math.floor(Math.random() * sizes.length)].id];
        if (Math.random() > 0.5) prodSizes.push(sizes[Math.floor(Math.random() * sizes.length)].id);

        const price = Math.floor(Math.random() * 100) + 20;
        const originalPrice = price + Math.floor(Math.random() * 50);

        const productDto = {
            name,
            description: `A high-quality ${name} designed for style and comfort. Perfect for any fashion-forward individual.`,
            price,
            originalPrice,
            categoryId,
            subcategoryId: sub.id,
            colorIds: prodColors,
            sizeIds: prodSizes,
            images: [`https://picsum.photos/seed/${name.replace(/ /g, '')}/600/800`],
            productCode: `NXW-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            availability: "in_stock"
        };

        await axios.post(`${BASE_URL}/product`, productDto, { headers: authHeader });
        console.log(`   + Product [${i+1}/30]: ${name}`);
    }

    console.log('\n✨ Seeding Completed Successfully! ✨');

  } catch (error) {
    console.error('❌ Error during seeding:', error.response?.data || error.message);
  }
}

seed();
