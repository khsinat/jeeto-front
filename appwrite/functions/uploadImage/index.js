const { Client, Storage, Databases, Permission, Role } = require('node-appwrite');

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
    const users = require('node-appwrite').Users(client);
    const user = await users.get(userId);
    
    // Check if user has admin role (you can customize this based on your role system)
    const isAdmin = user.labels.includes('admin') || user.labels.includes('Admin');
    if (!isAdmin) {
      return res.json({
        success: false,
        error: 'Admin access required'
      }, 403);
    }

    const { answer,mimeType } = JSON.parse(req.body);

    // Validate required fields
    if (!answer) {
      return res.json({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }
    if(!req.files || !req.files['image']){
        return res.json({
            success:false,
            error: "no file found"
        },400)
    }
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(mimeType)) {
      return res.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      }, 400);
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (size > maxSize) {
      return res.json({
        success: false,
        error: 'File size too large. Maximum size is 10MB.'
      }, 400);
    }

    // Check if file exists in storage
    const file = await storage.createFile(
        process.env.BUCKET_ID,
        ID.unique(),
        req.files['image'] // or however you receive the file
      );
      

    // Create document in images collection
    const imageDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.IMAGES_COLLECTION_ID,
      require('node-appwrite').ID.unique(),
      {
        fileId: file.$id,
        answer: req.body.answer,
        uploadedAt: new Date().toISOString(),
        used: "unused",
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );

    log.info(`Image uploaded successfully: ${imageDoc.$id}`);

    return res.json({
      success: true,
      data: imageDoc
    });

  } catch (err) {
    error(`Upload error: ${err.message}`);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}; 