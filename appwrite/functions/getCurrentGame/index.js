const { Client, Databases, Query } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // Get current active game
    const activeGames = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.GAMES_COLLECTION_ID,
      [
        Query.equal('status', 'active'),
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    );

    if (activeGames.documents.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No active game available'
      });
    }

    const currentGame = activeGames.documents[0];

    // Only return the new schema attributes
    const filteredGame = {
      imageId: currentGame.imageId,
      imageUrl: currentGame.imageUrl,
      startTime: currentGame.startTime,
      endTime: currentGame.endTime,
      status: currentGame.status,
      answer: currentGame.answer,
      pool: currentGame.pool
    };

    // Check if game has expired
    const now = new Date();
    const endTime = new Date(currentGame.endTime);
    
    if (now > endTime) {
      // Game has expired, mark it as ended
      await databases.updateDocument(
        process.env.DATABASE_ID,
        process.env.GAMES_COLLECTION_ID,
        currentGame.$id,
        {
          status: 'ended',
          endedAt: now.toISOString()
        }
      );

      // Mark image as used
      await databases.updateDocument(
        process.env.DATABASE_ID,
        process.env.IMAGES_COLLECTION_ID,
        currentGame.imageId,
        {
          used: 'used'
        }
      );

      return res.json({
        success: true,
        data: null,
        message: 'Game has expired'
      });
    }

    return res.json({
      success: true,
      data: filteredGame
    });

  } catch (err) {
    error(`Get current game error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 