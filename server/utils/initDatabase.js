import User from '../models/User.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import Post from '../models/Post.js';

/**
 * Initialize database with default data
 */
export const initDatabase = async () => {
  try {
    console.log('🌱 Initializing database with default data...');

    // Create default categories
    const categories = [
      {
        name: 'Lifestyle',
        description: 'Articles about luxury living and sophisticated lifestyle choices',
        image: '/images/category-lifestyle.jpg'
      },
      {
        name: 'Travel',
        description: 'Discover extraordinary destinations and luxury travel experiences',
        image: '/images/category-travel.jpg'
      },
      {
        name: 'Wellness',
        description: 'Holistic approaches to health, mindfulness, and wellbeing',
        image: '/images/category-wellness.jpg'
      },
      {
        name: 'Design',
        description: 'Timeless aesthetics and sophisticated design principles',
        image: '/images/category-design.jpg'
      }
    ];

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      if (!existingCategory) {
        await Category.create(categoryData);
        console.log(`✅ Created category: ${categoryData.name}`);
      }
    }

    // Create default tags
    const tags = [
      { name: 'Luxury', description: 'Premium and high-end content' },
      { name: 'Minimalism', description: 'Simple and refined living' },
      { name: 'Interior Design', description: 'Home and space design' },
      { name: 'Fine Dining', description: 'Culinary experiences and gastronomy' },
      { name: 'Mindfulness', description: 'Mental wellness and meditation' },
      { name: 'Fashion', description: 'Style and fashion trends' },
      { name: 'Art', description: 'Art and cultural experiences' }
    ];

    for (const tagData of tags) {
      const existingTag = await Tag.findOne({ name: tagData.name });
      if (!existingTag) {
        await Tag.create(tagData);
        console.log(`✅ Created tag: ${tagData.name}`);
      }
    }

    // Create admin user if doesn't exist
    let adminUser = await User.findOne({ email: 'admin@luxeblog.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'LuxeBlog Admin',
        email: 'admin@luxeblog.com',
        password: 'admin123', // Will be hashed by the model
        role: 'admin',
        membership: 'elite',
        bio: 'Administrator of LuxeBlog - Curator of luxury content and experiences'
      });
      console.log('✅ Created admin user');
    }

    // Create sample author users
    const authors = [
      {
        name: 'Sophia Laurent',
        email: 'sophia@luxeblog.com',
        password: 'author123',
        role: 'author',
        membership: 'premium',
        bio: 'Luxury lifestyle expert and writer'
      },
      {
        name: 'Alexander Grey',
        email: 'alex@luxeblog.com',
        password: 'author123',
        role: 'author',
        membership: 'premium',
        bio: 'Minimalist living advocate and design consultant'
      },
      {
        name: 'Emma Wilson',
        email: 'emma@luxeblog.com',
        password: 'author123',
        role: 'author',
        membership: 'premium',
        bio: 'Wellness and mindfulness coach'
      }
    ];

    // Create test user with 'user' role
    const testUser = await User.findOne({ email: 'testuser@luxeblog.com' });
    if (!testUser) {
      await User.create({
        name: 'Test User',
        email: 'testuser@luxeblog.com',
        password: 'testuser123',
        role: 'user',
        membership: 'free',
        bio: 'Test user for article posting'
      });
      console.log('✅ Created test user with user role');
    }

    const createdAuthors = [];
    for (const authorData of authors) {
      let author = await User.findOne({ email: authorData.email });
      if (!author) {
        author = await User.create(authorData);
        console.log(`✅ Created author: ${authorData.name}`);
      }
      createdAuthors.push(author);
    }

    // Get all categories for sample posts
    const lifestyleCategory = await Category.findOne({ name: 'Lifestyle' });
    const wellnessCategory = await Category.findOne({ name: 'Wellness' });
    const designCategory = await Category.findOne({ name: 'Design' });
    const travelCategory = await Category.findOne({ name: 'Travel' });

    // Create sample posts if none exist
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      const samplePosts = [
        {
          title: 'The Art of Luxury Living',
          slug: 'the-art-of-luxury-living',
          excerpt: 'Discover the principles of luxurious living and how to incorporate them into your everyday life.',
          content: `Luxury living isn't just about expensive things—it's about quality, intention, and creating experiences that enrich your life. 

In this comprehensive guide, we'll explore the fundamental principles that define true luxury living. From curating meaningful possessions to creating spaces that inspire tranquility, luxury is ultimately about making conscious choices that reflect your values and aspirations.

The first principle of luxury living is quality over quantity. Rather than filling your space with numerous items, focus on acquiring fewer, higher-quality pieces that serve both functional and aesthetic purposes. This approach creates a more refined environment and reduces the mental clutter that comes with excess.

Secondly, luxury living emphasizes the importance of experiences over material possessions. Whether it's a perfectly brewed cup of coffee in the morning or a thoughtfully prepared meal shared with loved ones, these moments of intention and presence are the true hallmarks of a luxurious lifestyle.

Finally, luxury living is deeply personal. What feels luxurious to one person may not resonate with another. The key is understanding your own preferences, values, and what brings you genuine joy and satisfaction.`,
          featuredImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          author: createdAuthors[0]._id,
          category: lifestyleCategory._id,
          status: 'published',
          isFeature: true,
          readTime: 5
        },
        {
          title: 'Minimalist Luxury: Less is More',
          slug: 'minimalist-luxury-less-is-more',
          excerpt: 'How embracing minimalism can actually enhance your luxury experience.',
          content: `Minimalist luxury represents a sophisticated approach to living that prioritizes quality, intention, and mindful consumption. This philosophy challenges the conventional notion that luxury must be abundant or ostentatious.

At its core, minimalist luxury is about curating a life filled with items and experiences that truly matter. It's the difference between a closet overflowing with mediocre clothing and a carefully selected wardrobe of exceptional pieces that you love and wear regularly.

The beauty of minimalist luxury lies in its emphasis on craftsmanship and authenticity. Each item in your space should serve a purpose and bring you joy. This approach not only creates a more peaceful environment but also allows you to fully appreciate and enjoy what you have.

When implementing minimalist luxury in your home, focus on natural materials, clean lines, and timeless design. Choose pieces that will age beautifully and maintain their appeal for years to come. This investment in quality over quantity ultimately proves more economical and environmentally responsible.

Remember, minimalist luxury is not about deprivation—it's about conscious choice and intentional living.`,
          featuredImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          author: createdAuthors[1]._id,
          category: lifestyleCategory._id,
          status: 'published',
          readTime: 4
        },
        {
          title: 'The Perfect Morning Routine',
          slug: 'the-perfect-morning-routine',
          excerpt: 'Start your day with intention and elegance using this curated morning routine.',
          content: `A thoughtfully crafted morning routine sets the tone for your entire day. It's an opportunity to center yourself, establish intentions, and create a foundation of calm before the demands of daily life take over.

The perfect morning routine begins the night before with proper preparation. Lay out your clothes, prepare your coffee setup, and ensure your space is organized and peaceful. This removes decision fatigue and allows you to move through your morning with grace and ease.

Upon waking, resist the urge to immediately check your phone. Instead, take a few moments to breathe deeply and appreciate the quiet of the early morning. This simple practice helps maintain the peaceful energy of sleep while gradually awakening your mind and body.

Incorporate movement that feels good to your body—this might be gentle stretching, yoga, or a walk outside. The goal is not intense exercise but rather mindful movement that helps you feel grounded and energized.

Finally, nourish yourself with a breakfast that you've prepared mindfully. Whether it's a perfectly brewed cup of coffee or a beautifully plated meal, eating with intention and gratitude transforms a basic necessity into a luxurious experience.

The key to maintaining any routine is consistency and flexibility. Start small, be patient with yourself, and adjust as needed to create a morning practice that truly serves you.`,
          featuredImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          author: createdAuthors[2]._id,
          category: wellnessCategory._id,
          status: 'published',
          readTime: 3
        },
        {
          title: 'Essential Elements of Timeless Interior Design',
          slug: 'essential-elements-of-timeless-interior-design',
          excerpt: 'Principles and elements that create spaces with enduring elegance.',
          content: `Timeless interior design transcends trends and creates spaces that remain beautiful and relevant for decades. Understanding the fundamental principles of timeless design allows you to create environments that feel both current and enduring.

The foundation of timeless design lies in proportion and balance. Rooms that feel harmonious typically follow classic proportions and maintain visual equilibrium between different elements. This doesn't mean everything must be symmetrical, but rather that the overall composition feels stable and pleasing to the eye.

Quality materials are essential to timeless design. Natural materials like wood, stone, linen, and wool age beautifully and develop character over time. These materials also connect us to nature and create a sense of warmth and authenticity that synthetic materials often lack.

Neutral color palettes form the backdrop of timeless interiors. This doesn't mean everything must be beige—rather, choose colors that you can live with for years to come. Deep blues, warm grays, and rich creams can all serve as sophisticated neutrals when used thoughtfully.

Finally, timeless design incorporates personal touches and meaningful objects. Whether it's art that speaks to you, books that reflect your interests, or objects with sentimental value, these personal elements make a space feel authentic and lived-in.

Remember, the goal of timeless design is not to create a museum but to craft a space that supports and enhances your daily life while remaining beautiful for years to come.`,
          featuredImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          author: adminUser._id,
          category: designCategory._id,
          status: 'published',
          readTime: 8
        },
        {
          title: 'Culinary Experiences Worth Traveling For',
          slug: 'culinary-experiences-worth-traveling-for',
          excerpt: 'Extraordinary dining destinations that combine exceptional food with unforgettable atmospheres.',
          content: `Food has the remarkable ability to transport us to different cultures and create lasting memories. Some culinary experiences are so exceptional that they become the primary reason to visit a destination.

From intimate chef's table experiences in hidden local gems to Michelin-starred establishments that push the boundaries of gastronomy, the world offers countless opportunities for memorable dining experiences. What sets these experiences apart is not just the quality of the food, but the story, atmosphere, and passion behind each dish.

Consider the small family-run trattorias in Italy where recipes have been passed down through generations, or the innovative restaurants in Tokyo where chefs spend decades perfecting their craft. These establishments offer more than just a meal—they provide a window into local culture and culinary tradition.

When seeking out exceptional culinary experiences, look beyond the obvious choices. Some of the most memorable meals happen in unexpected places: a perfectly prepared bowl of pho from a street vendor in Vietnam, fresh seafood at a beachside taverna in Greece, or artisanal cheese and wine at a small farm in France.

The key to discovering these experiences is approaching food with curiosity and openness. Talk to locals, explore markets, and be willing to try something new. The most rewarding culinary adventures often come from stepping outside your comfort zone and embracing the unknown.`,
          featuredImage: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          author: createdAuthors[0]._id,
          category: travelCategory._id,
          status: 'published',
          readTime: 6
        },
        {
          title: 'The Science of Quality Sleep',
          slug: 'the-science-of-quality-sleep',
          excerpt: 'How to create the perfect sleep environment for rejuvenation and wellness.',
          content: `Quality sleep is the foundation of wellness, affecting everything from our mood and cognitive function to our physical health and appearance. Creating an optimal sleep environment is one of the most important investments you can make in your overall well-being.

The science of sleep reveals that our bodies follow natural circadian rhythms that are influenced by light, temperature, and routine. Understanding these patterns allows us to work with our biology rather than against it to achieve better rest.

Temperature plays a crucial role in sleep quality. The ideal bedroom temperature is typically between 65-68°F (18-20°C). Your body naturally drops in temperature as you prepare for sleep, and a cooler environment supports this process. Invest in breathable bedding materials like cotton or linen that help regulate temperature throughout the night.

Light exposure significantly impacts your sleep-wake cycle. In the evening, dim lights and avoid screens for at least an hour before bedtime. Consider blackout curtains or an eye mask to create complete darkness. Conversely, expose yourself to natural light in the morning to help regulate your circadian rhythm.

Your sleep environment should be a sanctuary dedicated to rest. Remove distractions like work materials, exercise equipment, or electronic devices. Instead, create a space that signals to your brain that it's time to unwind and restore.

Finally, establish a consistent bedtime routine that helps transition your mind and body from the activity of the day to the restfulness of night. This might include gentle stretching, reading, or meditation—whatever helps you feel calm and centered.`,
          featuredImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          author: createdAuthors[2]._id,
          category: wellnessCategory._id,
          status: 'published',
          readTime: 7
        }
      ];

      for (const postData of samplePosts) {
        await Post.create(postData);
        console.log(`✅ Created sample post: ${postData.title}`);
      }
    }

    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};
