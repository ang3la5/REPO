const { Movie, Season, Episode } = require('../models');

exports.getFullSeries = async (req, res) => {
  const { id } = req.params;

  try {
    const series = await Movie.findOne({
      where: { id, type: 'series' },
      include: [
        {
          model: Season,
          as: 'seasons',
          include: [
            {
              model: Episode,
              as: 'episodes',
              order: [['number', 'ASC']]
            }
          ],
          order: [['number', 'ASC']]
        }
      ]
    });

    if (!series) {
      return res.status(404).json({ message: "Series not found." });
    }

    res.status(200).json(series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
