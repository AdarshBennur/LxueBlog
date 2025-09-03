import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

/**
 * @desc    Get comments for a post
 * @route   GET /api/comments/post/:postId
 * @access  Public
 */
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parent: null,
      status: 'approved'
    })
      .populate('user', 'name avatar')
      .populate({
        path: 'replies',
        match: { status: 'approved' },
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      })
      .sort({ createdAt: 1 }); // Sort by creation date ascending

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
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
 * @desc    Add comment to a post
 * @route   POST /api/comments
 * @access  Public (supports both authenticated and guest users)
 */
export const addComment = async (req, res) => {
  try {
    const { content, postId, parentId, guestName, guestEmail } = req.body;

    // Validate required fields
    if (!content || !postId) {
      return res.status(400).json({
        success: false,
        message: 'Content and post ID are required'
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Determine if this is a guest comment
    const isGuest = !req.user;
    
    // Validate guest fields if it's a guest comment
    if (isGuest) {
      if (!guestName || !guestEmail) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required for guest comments'
        });
      }
    }

    // Sanitize content to prevent XSS
    const sanitizedContent = content.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Create comment data
    const commentData = {
      content: sanitizedContent,
      post: postId,
      parent: parentId || null,
      isGuest
    };

    // Add user or guest data
    if (isGuest) {
      commentData.guestName = guestName.trim();
      commentData.guestEmail = guestEmail.trim();
      commentData.status = 'pending'; // Guest comments need approval
    } else {
      commentData.user = req.user.id;
      // Auto-approve comments from admins and authors
      commentData.status = ['admin', 'author'].includes(req.user.role) ? 'approved' : 'pending';
    }

    // Create comment
    const comment = await Comment.create(commentData);

    // Populate user data if not a guest
    if (!isGuest) {
      await comment.populate('user', 'name avatar');
    }

    res.status(201).json({
      success: true,
      data: comment,
      message: isGuest ? 'Your comment has been submitted and is pending approval' : 'Comment added successfully'
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
 * @desc    Update comment
 * @route   PUT /api/comments/:id
 * @access  Private
 */
export const updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      data: comment
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
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

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

/**
 * @desc    Approve comment (Admin only)
 * @route   PUT /api/comments/:id/approve
 * @access  Private (Admin)
 */
export const approveComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
