const { Client, Databases, Query, ID } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // Check if user is authenticated (for admin-triggered games)
    const userId = req.headers['x-appwrite-user-id'];
    const isAdminTriggered = userId && req.body?.adminTriggered === true;

    // Get unused images
    const unusedImages = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      [
        Query.equal('used', 'unused'),
        Query.orderAsc('$createdAt') // Get oldest unused image first
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

    // Construct imageUrl from fileId (assuming public bucket)
    const imageUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.BUCKET_ID}/files/${selectedImage.fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

    // Create new game with updated attributes
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

    // Mark image as current
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
    error(`Create game error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 