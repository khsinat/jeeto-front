const { Client, Databases } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

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
    const users = require('node-appwrite').Users(client);
    const user = await users.get(userId);
    
    // Check if user has admin role
    const isAdmin = user.labels.includes('admin') || user.labels.includes('Admin');
    if (!isAdmin) {
      return res.json({
        success: false,
        error: 'Admin access required'
      }, 403);
    }

    const { imageId, description } = JSON.parse(req.body);

    // Validate required fields
    if (!imageId) {
      return res.json({
        success: false,
        error: 'Image ID is required'
      }, 400);
    }

    // Update the image document
    const updatedDoc = await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      imageId,
      {
        description: description ? description.trim() : ''
      }
    );

    log.info(`Image updated successfully: ${imageId}`);

    return res.json({
      success: true,
      data: updatedDoc
    });

  } catch (err) {
    error(`Update error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 