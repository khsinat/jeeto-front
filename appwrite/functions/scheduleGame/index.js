const { Client, Databases, Query, ID } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // Check if there's already an active game
    const activeGames = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.GAMES_COLLECTION_ID,
      [
        Query.equal('status', 'active'),
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    );

    if (activeGames.documents.length > 0) {
      const currentGame = activeGames.documents[0];
      const now = new Date();
      const endTime = new Date(currentGame.endTime);
      
      // If current game hasn't expired yet, don't create a new one
      if (now <= endTime) {
        return res.json({
          success: true,
          data: currentGame,
          message: 'Current game is still active'
        });
      }

      // End the current game
      await databases.updateDocument(
        process.env.DATABASE_ID,
        process.env.GAMES_COLLECTION_ID,
        currentGame.$id,
        {
          status: 'ended',
          endedAt: now.toISOString()
        }
      );

      // Mark the image as used
      await databases.updateDocument(
        process.env.DATABASE_ID,
        process.env.IMAGES_COLLECTION_ID,
        currentGame.imageId,
        {
          used: 'used'
        }
      );
    }

    // Get unused images
    const unusedImages = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      [
        Query.equal('used', 'unused'),
        Query.orderAsc('$createdAt')
      ]
    );

    if (unusedImages.documents.length === 0) {
      return res.json({
        success: false,
        error: 'No unused images available for new game'
      }, 400);
    }

    // Get the oldest unused image
    const selectedImage = unusedImages.documents[0];

    // Create new game
    const gameDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.GAMES_COLLECTION_ID,
      ID.unique(),
      {
        imageId: selectedImage.$id,
        imageFileId: selectedImage.fileId,
        answer: selectedImage.answer,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
        status: 'active',
        totalBets: 0,
        totalAmount: 0,
        createdAt: new Date().toISOString()
      }
    );

    // Mark image as current
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      selectedImage.$id,
      {
        used: 'current'
      }
    );

    log.info(`New game scheduled: ${gameDoc.$id} with image: ${selectedImage.$id}`);

    return res.json({
      success: true,
      data: gameDoc
    });

  } catch (err) {
    error(`Schedule game error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 