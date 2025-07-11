const { Client, Databases, Query, ID } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // 1. Check if a game is currently running (status: 'active')
    const activeGames = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.GAMES_COLLECTION_ID,
      [
        Query.equal('status', 'active'),
        Query.limit(1)
      ]
    );
    if (activeGames.documents.length > 0) {
      log.info('Active game already running, not starting a new one.');
      return res.json({
        success: true,
        message: 'Active game already running.'
      });
    }

    // 2. Find an unused image
    const unusedImages = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      [
        Query.equal('used', 'unused'),
        Query.orderAsc('$createdAt'),
        Query.limit(1)
      ]
    );
    if (unusedImages.documents.length === 0) {
      log.info('No unused images available to start a new game.');
      return res.json({
        success: false,
        error: 'No unused images available.'
      }, 400);
    }
    const selectedImage = unusedImages.documents[0];

    // Construct imageUrl from fileId (assuming public bucket)
    const imageUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.BUCKET_ID}/files/${selectedImage.fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

    // 3. Create a new game with updated attributes
    const now = new Date();
    const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now
    const gameDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.GAMES_COLLECTION_ID,
      ID.unique(),
      {
        imageId: selectedImage.$id,
        imageUrl: imageUrl,
        answer: selectedImage.answer,
        startTime: now.toISOString(),
        endTime: endTime.toISOString(),
        status: 'active',
        pool: 0
      }
    );

    // 4. Mark image as current
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      selectedImage.$id,
      {
        used: 'current'
      }
    );

    log.info(`New game created: ${gameDoc.$id} with image: ${selectedImage.$id}`);
    return res.json({
      success: true,
      data: gameDoc
    });
  } catch (err) {
    error(`maybeStartGame error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 