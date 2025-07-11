const { Client, Storage, Databases,Users } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new Storage(client);
    const databases = new Databases(client);

    // Check if user is authenticated
    const userId = req.headers['x-appwrite-user-id'];
    if (!userId) {
      return res.json({
        success: false,
        error: 'Authentication required'
      }, 401);
    }

    // Get user details to check if admin
    const users = await Users(client);
    const user = await users.get(userId);
    
    // Check if user has admin role
    const isAdmin = user.labels.includes('admin') || user.labels.includes('Admin') || user.labels.includes('ADMIN');
    if (!isAdmin) {
      return res.json({
        success: false,
        error: 'Admin access required'
      }, 403);
    }

    const { imageId, fileId } = JSON.parse(req.body);

    // Validate required fields
    if (!imageId || !fileId) {
      return res.json({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    // Check if image is currently being used in a game
    try {
      const imageDoc = await databases.getDocument(
        process.env.DATABASE_ID,
        process.env.IMAGES_COLLECTION_ID,
        imageId
      );

      if (imageDoc.used) {
        return res.json({
          success: false,
          error: 'Cannot delete image that is currently being used in a game'
        }, 400);
      }
    } catch (err) {
      return res.json({
        success: false,
        error: 'Image not found'
      }, 404);
    }

    // Delete from storage first
    try {
      await storage.deleteFile(process.env.BUCKET_ID, fileId);
    } catch (err) {
      log.warn(`File not found in storage: ${fileId}`);
    }

    // Delete from database
    await databases.deleteDocument(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      imageId
    );

    log.info(`Image deleted successfully: ${imageId}`);

    return res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (err) {
    error(`Delete error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 