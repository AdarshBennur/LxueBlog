import Post from '../models/Post.js';
import Category from '../models/Category.js';

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
export const getPosts = async (req, res) => {
  try {
    console.log('📄 getPosts endpoint called');
    console.log('Query parameters:', req.query);
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100; // Increased default limit
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Count total published posts
    const total = await Post.countDocuments({ status: 'published' });
    console.log(`📊 Total published posts in database: ${total}`);

    // Query options
    const query = { status: 'published' };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }
    
    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }
    
    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    console.log('🔍 Query object:', JSON.stringify(query, null, 2));

    // Execute query
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    console.log(`✅ Found ${posts.length} posts matching query`);
    
    if (posts.length > 0) {
      console.log('📋 First post sample:', {
        title: posts[0].title,
        author: posts[0].author?.name,
        category: posts[0].category?.name,
        status: posts[0].status,
        createdAt: posts[0].createdAt
      });
    }

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    const response = {
      success: true,
      count: posts.length,
      total,
      pagination,
      data: posts
    };

    console.log(`📤 Sending response with ${response.count} posts`);
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error in getPosts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single post
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate({
        path: 'comments',
        match: { status: 'approved', parent: null },
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get post by slug
 * @route   GET /api/posts/slug/:slug
 * @access  Public
 */
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate({
        path: 'comments',
        match: { status: 'approved', parent: null },
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private (Author, Admin)
 */
export const createPost = async (req, res) => {
  try {
    // Add author to request body
    req.body.author = req.user.id;

    // Handle category - if it's a string, find or create the category
    if (req.body.category && typeof req.body.category === 'string') {
      let category = await Category.findOne({ 
        $or: [
          { name: { $regex: new RegExp(`^${req.body.category}$`, 'i') } },
          { slug: req.body.category.toLowerCase() }
        ]
      });
      
      if (!category) {
        // Create new category if it doesn't exist
        category = await Category.create({
          name: req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1),
          description: `Articles about ${req.body.category}`
        });
      }
      
      req.body.category = category._id;
    }

    const post = await Post.create(req.body);
    
    // Populate the created post with category and author info
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private (Author, Admin)
 */
export const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    // Handle category - if it's a string, find or create the category
    if (req.body.category && typeof req.body.category === 'string') {
      let category = await Category.findOne({ 
        $or: [
          { name: { $regex: new RegExp(`^${req.body.category}$`, 'i') } },
          { slug: req.body.category.toLowerCase() }
        ]
      });
      
      if (!category) {
        // Create new category if it doesn't exist
        category = await Category.create({
          name: req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1),
          description: `Articles about ${req.body.category}`
        });
      }
      
      req.body.category = category._id;
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name avatar')
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get posts by user (for My Articles page)
 * @route   GET /api/posts/user/:userId
 * @access  Private
 */
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    console.log(`👤 getUserPosts called for userId: ${userId}`);
    console.log(`🔐 Requesting user: ${req.user.id}, Role: ${req.user.role}`);
    
    // Ensure user can only access their own posts unless admin
    if (userId !== req.user.id && req.user.role !== 'admin') {
      console.log('❌ Unauthorized access attempt');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access these posts'
      });
    }

    console.log(`🔍 Searching for posts by author: ${userId}`);
    const posts = await Post.find({ author: userId })
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${posts.length} posts for user ${userId}`);
    
    if (posts.length > 0) {
      console.log('📋 User posts sample:', {
        title: posts[0].title,
        status: posts[0].status,
        createdAt: posts[0].createdAt
      });
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('❌ Error in getUserPosts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private (Author, Admin)
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
