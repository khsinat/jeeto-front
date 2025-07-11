#!/bin/bash

# Deploy Appwrite Functions for Admin Upload Flow
# Make sure you have Appwrite CLI installed and configured

echo "🚀 Deploying Appwrite Functions for Admin Upload Flow..."

# Function IDs (update these with your actual function IDs)
UPLOAD_FUNCTION_ID="uploadImage"
DELETE_FUNCTION_ID="deleteImage"
UPDATE_FUNCTION_ID="updateImage"
GET_UNUSED_FUNCTION_ID="getUnusedImages"
MARK_USED_FUNCTION_ID="markImageAsUsed"
CREATE_GAME_FUNCTION_ID="createGame"
END_GAME_FUNCTION_ID="endGame"
GET_CURRENT_GAME_FUNCTION_ID="getCurrentGame"
SCHEDULE_GAME_FUNCTION_ID="scheduleGame"

# Deploy uploadImage function
echo "📤 Deploying uploadImage function..."
appwrite functions create \
  --functionId $UPLOAD_FUNCTION_ID \
  --name "Upload Image" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $UPLOAD_FUNCTION_ID \
  --code ./functions/uploadImage

# Deploy deleteImage function
echo "🗑️ Deploying deleteImage function..."
appwrite functions create \
  --functionId $DELETE_FUNCTION_ID \
  --name "Delete Image" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $DELETE_FUNCTION_ID \
  --code ./functions/deleteImage

# Deploy updateImage function
echo "✏️ Deploying updateImage function..."
appwrite functions create \
  --functionId $UPDATE_FUNCTION_ID \
  --name "Update Image" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $UPDATE_FUNCTION_ID \
  --code ./functions/updateImage

# Deploy getUnusedImages function
echo "📋 Deploying getUnusedImages function..."
appwrite functions create \
  --functionId $GET_UNUSED_FUNCTION_ID \
  --name "Get Unused Images" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $GET_UNUSED_FUNCTION_ID \
  --code ./functions/getUnusedImages

# Deploy markImageAsUsed function
echo "🏷️ Deploying markImageAsUsed function..."
appwrite functions create \
  --functionId $MARK_USED_FUNCTION_ID \
  --name "Mark Image as Used" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $MARK_USED_FUNCTION_ID \
  --code ./functions/markImageAsUsed

# Deploy createGame function
echo "🎮 Deploying createGame function..."
appwrite functions create \
  --functionId $CREATE_GAME_FUNCTION_ID \
  --name "Create Game" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $CREATE_GAME_FUNCTION_ID \
  --code ./functions/createGame

# Deploy endGame function
echo "🏁 Deploying endGame function..."
appwrite functions create \
  --functionId $END_GAME_FUNCTION_ID \
  --name "End Game" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $END_GAME_FUNCTION_ID \
  --code ./functions/endGame

# Deploy getCurrentGame function
echo "📊 Deploying getCurrentGame function..."
appwrite functions create \
  --functionId $GET_CURRENT_GAME_FUNCTION_ID \
  --name "Get Current Game" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $GET_CURRENT_GAME_FUNCTION_ID \
  --code ./functions/getCurrentGame

# Deploy scheduleGame function
echo "⏰ Deploying scheduleGame function..."
appwrite functions create \
  --functionId $SCHEDULE_GAME_FUNCTION_ID \
  --name "Schedule Game" \
  --runtime node-18.0 \
  --execute admin \
  --events [] \
  --schedule "" \
  --timeout 30

appwrite functions createDeployment \
  --functionId $SCHEDULE_GAME_FUNCTION_ID \
  --code ./functions/scheduleGame

echo "✅ All functions deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables for each function in Appwrite Console"
echo "2. Update function IDs in your frontend code"
echo "3. Test the admin upload flow"
echo ""
echo "🔧 Environment variables needed:"
echo "- APPWRITE_ENDPOINT"
echo "- APPWRITE_PROJECT_ID" 
echo "- APPWRITE_API_KEY"
echo "- DATABASE_ID"
echo "- IMAGES_COLLECTION_ID"
echo "- BUCKET_ID" 