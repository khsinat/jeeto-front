const { Client, Databases } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    const { gameId } = JSON.parse(req.body);

    if (!gameId) {
      return res.json({
        success: false,
        error: 'Game ID is required'
      }, 400);
    }

    // Get the game
    const game = await databases.getDocument(
      process.env.DATABASE_ID,
      process.env.GAMES_COLLECTION_ID,
      gameId
    );

    if (!game) {
      return res.json({
        success: false,
        error: 'Game not found'
      }, 404);
    }

    // Update game status to ended
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.GAMES_COLLECTION_ID,
      gameId,
      {
        status: 'ended',
        endedAt: new Date().toISOString()
      }
    );

    // Mark image as used
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      game.imageId,
      {
        used: 'used'
      }
    );

    log.info(`Game ended: ${gameId}, image marked as used: ${game.imageId}`);

    return res.json({
      success: true,
      message: 'Game ended successfully'
    });

  } catch (err) {
    error(`End game error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 