const { Client, Databases, Query,Users } = require('node-appwrite');

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

    // Get unused images
    const response = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      [
        Query.equal('used', "unused"),
        Query.orderDesc('$createdAt')
      ]
    );

    log.info(`Retrieved ${response.documents.length} unused images`);

    return res.json({
      success: true,
      data: response.documents,
      total: response.total
    });

  } catch (err) {
    error(`Get unused images error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 