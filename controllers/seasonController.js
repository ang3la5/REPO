const { Season } = require('../models');

exports.deleteSeason = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await Season.findByPk(id);
    if (!season) return res.status(404).json({ message: "Season not found" });

    await season.destroy();
    res.status(200).json({ message: "Season deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
