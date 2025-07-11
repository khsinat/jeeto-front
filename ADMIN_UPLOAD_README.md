# Admin Upload Flow - Complete Implementation

This document provides a complete implementation of the admin upload flow for your betting game app, including frontend components, Appwrite functions, and setup instructions.

## Overview

The admin upload flow allows administrators to:
- Upload images to Appwrite Storage
- Manage uploaded images (view, edit, delete)
- Track image usage in games
- Secure admin-only access

## File Structure

```
src/
├── components/
│   ├── AdminUpload.tsx          # Main admin upload component
│   └── AdminRoute.tsx           # Admin route protection
├── hooks/
│   └── useAppwriteFunctions.ts  # Custom hook for Appwrite functions
├── pages/
│   └── AdminPage.tsx            # Admin page wrapper
└── lib/
    └── appwrite.ts              # Appwrite client configuration

appwrite/functions/
├── uploadImage/
│   └── index.js                 # Upload image function
├── deleteImage/
│   └── index.js                 # Delete image function
├── updateImage/
│   └── index.js                 # Update image function
├── getUnusedImages/
│   └── index.js                 # Get unused images function
└── markImageAsUsed/
    └── index.js                 # Mark image as used function
```

## Setup Instructions

### 1. Appwrite Configuration

#### Database Collections

Create the following collections in your Appwrite database:

**Images Collection (`images`)**
```json
{
  "fileId": "string",
  "name": "string", 
  "size": "integer",
  "mimeType": "string",
  "bucketId": "string",
  "uploadedBy": "string",
  "uploadedAt": "string",
  "used": "boolean",
  "gameId": "string?",
  "description": "string?"
}
```

**Permissions:**
- Read: Any authenticated user
- Create: Admin users only
- Update: Admin users only  
- Delete: Admin users only

#### Storage Bucket

Create a storage bucket named `images` with the following settings:
- File size limit: 10MB
- Allowed file extensions: jpg, jpeg, png, gif, webp
- Permissions: Read for any authenticated user, Write for admin users only

### 2. Appwrite Functions

Deploy the following functions to your Appwrite project:

#### Environment Variables
Set these environment variables for each function:
```
APPWRITE_ENDPOINT=your-appwrite-endpoint
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
DATABASE_ID=jeeto
IMAGES_COLLECTION_ID=images
BUCKET_ID=images
```

#### Function IDs
After deploying, note the function IDs and update them in your frontend code:
- `uploadImage`
- `deleteImage` 
- `updateImage`
- `getUnusedImages`
- `markImageAsUsed`

### 3. Admin User Setup

To mark a user as admin, add the label "admin" to their user account in Appwrite Console:

1. Go to Appwrite Console > Users
2. Find the user you want to make admin
3. Click on the user
4. Add the label "admin" (case-sensitive)
5. Save changes

## Frontend Components

### AdminUpload Component

The main component provides:
- **Upload Tab**: File selection and upload with progress tracking
- **Manage Tab**: View, edit, and delete uploaded images
- **Real-time Updates**: Automatic refresh after operations
- **Error Handling**: Toast notifications for success/error states

### Key Features

1. **File Upload**
   - Multiple file selection
   - File type validation (images only)
   - File size validation (10MB limit)
   - Progress tracking
   - Error handling

2. **Image Management**
   - Grid view of uploaded images
   - Image details modal
   - Description editing
   - Delete confirmation
   - Usage status tracking

3. **Security**
   - Admin-only access
   - Server-side validation
   - Secure file handling

## Usage

### Adding to Routes

```tsx
import AdminPage from '@/pages/AdminPage';

// In your router configuration
<Route path="/admin" element={<AdminPage />} />
```

### Admin Access

Users with the "admin" label can access the admin panel. The component automatically checks for admin privileges and redirects non-admin users.

## API Functions

### uploadImage
- **Purpose**: Upload and register new images
- **Input**: File data (fileId, name, size, mimeType, description)
- **Output**: Success status and image document
- **Security**: Admin authentication required

### deleteImage  
- **Purpose**: Delete images from storage and database
- **Input**: Image ID and file ID
- **Output**: Success status
- **Security**: Admin authentication required, prevents deletion of used images

### updateImage
- **Purpose**: Update image description
- **Input**: Image ID and new description
- **Output**: Updated image document
- **Security**: Admin authentication required

### getUnusedImages
- **Purpose**: Get list of unused images for game scheduling
- **Input**: None
- **Output**: Array of unused image documents
- **Security**: Admin authentication required

### markImageAsUsed
- **Purpose**: Mark image as used when assigned to a game
- **Input**: Image ID and game ID
- **Output**: Updated image document
- **Security**: Admin authentication required

## Error Handling

The system includes comprehensive error handling:

1. **Authentication Errors**: Redirect to login
2. **Authorization Errors**: Show admin access required message
3. **Validation Errors**: Display specific error messages
4. **Network Errors**: Retry mechanisms and fallback states
5. **File Errors**: Size and type validation

## Security Considerations

1. **Admin Authentication**: All functions verify admin status
2. **File Validation**: Server-side file type and size checks
3. **Permission Checks**: Database and storage permissions enforced
4. **Input Sanitization**: All inputs validated and sanitized
5. **Error Information**: Limited error details to prevent information leakage

## Integration with Game System

The upload system integrates with your game scheduling:

1. **Image Assignment**: When creating a new game, call `getUnusedImages` to get available images
2. **Usage Tracking**: Call `markImageAsUsed` when assigning an image to a game
3. **Cleanup**: Images are automatically marked as used/unused based on game status

## Customization

### Styling
The components use shadcn/ui components and can be customized by:
- Modifying the component classes
- Updating the theme configuration
- Adding custom CSS

### Functionality
Extend the system by:
- Adding image categories/tags
- Implementing bulk operations
- Adding image preview functionality
- Creating image usage analytics

## Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check file size and type
   - Verify admin permissions
   - Check network connectivity

2. **Admin Access Denied**
   - Verify user has "admin" label
   - Check function permissions
   - Ensure proper authentication

3. **Images Not Loading**
   - Check storage bucket permissions
   - Verify file IDs are correct
   - Check network connectivity

### Debug Mode

Enable debug logging by adding console.log statements in the functions and checking the Appwrite function logs.

## Performance Considerations

1. **Image Optimization**: Consider implementing image compression
2. **Caching**: Implement client-side caching for frequently accessed images
3. **Pagination**: For large image collections, implement pagination
4. **CDN**: Use Appwrite's CDN for faster image delivery

## Future Enhancements

1. **Drag & Drop**: Add react-dropzone for better UX
2. **Image Preview**: Implement actual image previews
3. **Bulk Operations**: Add bulk upload and delete
4. **Image Categories**: Add tagging and categorization
5. **Analytics**: Track image usage and performance metrics 