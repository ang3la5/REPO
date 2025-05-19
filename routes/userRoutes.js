const express = require('express');
const { registerUser, loginUser, promoteUserToAdmin, updateUserProfile, getTopReviewers, getUserProfile } = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
const { User, MoviePreference } = require('../models'); 
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');



router.get('/leaderboard/reviews', getTopReviewers);

router.get('/me', authenticate, getUserProfile);

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

router.put('/me', authenticate, updateUserProfile);


// Promote User to Admin (Protected Route - Admin Only)
router.put('/promote/:id', authenticate, isAdmin, promoteUserToAdmin);

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['username', 'email', 'avatarUrl'],
      include: [{
        model: MoviePreference,
        as: 'preferences',
        attributes: ['genre_preference', 'favorite_actors', 'favorite_directors']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pref = user.preferences || {};

    res.json({
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      preferences: {
        genres: pref.genre_preference ? pref.genre_preference.split(',') : [],
        favoriteActors: pref.favorite_actors ? pref.favorite_actors.split(',') : [],
        favoriteDirectors: pref.favorite_directors ? pref.favorite_directors.split(',') : []
      }
    });
  } catch (err) {
    console.error('Error in GET /me:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Upload avatar
router.post('/avatar', authenticate, (req, res, next) => {
  upload.single('avatar')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred.
      return res.status(400).json({ error: err.message });
    }

    // Proceed to Cloudinary + DB update
    (async () => {
      try {
        if (!req.file) throw new Error('No file uploaded');

        const user = await User.findByPk(req.user.id);
        if (user.avatarUrl) {
          const parts = user.avatarUrl.split('/');
          const publicId = parts[parts.length - 1].split('.')[0];
          const fullPublicId = `avatars/${publicId}`;
          await cloudinary.uploader.destroy(fullPublicId);
        }

        const newAvatarUrl = req.file.path;
        await User.update({ avatarUrl: newAvatarUrl }, { where: { id: req.user.id } });

        res.json({ avatarUrl: newAvatarUrl });
      } catch (err) {
        console.error('Avatar upload error:', err);
        res.status(500).json({ error: err.message });
      }
    })();
  });
});



module.exports = router;
