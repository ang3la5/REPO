const { Episode } = require('../models');

exports.deleteEpisode = async (req, res) => {
  const { id } = req.params;

  try {
    const episode = await Episode.findByPk(id);
    if (!episode) return res.status(404).json({ message: "Episode not found" });

    await episode.destroy();
    res.status(200).json({ message: "Episode deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
