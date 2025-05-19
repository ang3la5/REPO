const { User, UserList, Review, MoviePreference, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');


exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    console.log('New user created:', user.id);

    await UserList.bulkCreate([
      { name: 'Watchlist', user_id: user.id, isDefault: true },
      { name: 'Favorites', user_id: user.id, isDefault: true }
    ]);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error('Registration failed:', error);  // 🔥 catch the full error
    res.status(500).json({ error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.status(200).json({
  token,
  user: {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  }
});

};

exports.promoteUserToAdmin = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = 'admin'; // Update the user's role
    await user.save(); // Save the changes to the database

    res.status(200).json({ message: `${user.username} has been promoted to admin.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username;
    await user.save();

    res.json({ message: 'Username updated' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const calculateLevel = (reviewCount) => {
  return Math.floor(reviewCount / 5); // 5 reviews per level
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      include: [
        { model: Review, as: 'reviews' },
        { model: MoviePreference, as: 'preferences' }  // ✅ add this line
      ]
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const reviewCount = user.reviews.length;
    const level = Math.floor(reviewCount / 5);

    res.json({ ...user.toJSON(), reviewCount, level });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTopReviewers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'username',
        'avatarUrl',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM reviews
          WHERE reviews.user_id = User.id
        )`), 'reviewCount']
      ],
      order: [[Sequelize.literal('reviewCount'), 'DESC']],
      limit: 3
    });

    const result = users.map((user) => {
      const reviewCount = parseInt(user.getDataValue('reviewCount')) || 0;
      return {
        username: user.username,
        avatarUrl: user.avatarUrl,
        reviewCount,
        level: Math.floor(reviewCount / 5)
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: error.message });
  }
};

