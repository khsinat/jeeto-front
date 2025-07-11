# Game Scheduling & Image Rotation System

This document explains the complete game scheduling and image rotation system for your betting game app.

## 🎯 **System Overview**

The system automatically manages games with the following features:
- **3-hour game cycles** with automatic rotation
- **Image status tracking** (unused → current → used)
- **Automatic game creation** when images are uploaded
- **Real-time countdown** and progress tracking
- **No games available** message when no unused images exist

## 📊 **Database Collections**

### **Images Collection** (`images`)
```json
{
  "fileId": "string",      // Storage file ID
  "answer": "string",      // Correct answer for the image
  "uploadedAt": "string",  // When image was uploaded
  "used": "enum"          // "unused" | "current" | "used"
}
```

### **Games Collection** (`games`)
```json
{
  "imageId": "string",        // Reference to image document
  "imageUrl": "string",       // Public URL for the image
  "answer": "string",         // Correct answer
  "startTime": "string",      // Game start timestamp
  "endTime": "string",        // Game end timestamp (3 hours later)
  "status": "enum",           // "active" | "ended"
  "pool": "integer"           // Total pool amount
}
```

## 🔄 **Game Lifecycle**

### **1. Image Upload (Admin)**
```
Admin uploads image → Image marked as "unused" → 
Check if no active game → Create new game → 
Image marked as "current"
```

### **2. Game Execution (3 hours)**
```
Game starts → Image displayed to users → 
Users place bets → Countdown timer → 
Game expires → Image marked as "used"
```

### **3. Automatic Rotation**
```
Game ends → Check for unused images → 
Create new game → Next image marked as "current"
```

## ⚙️ **Appwrite Functions**

### **1. `createGame`**
- **Purpose**: Create a new game with an unused image
- **Trigger**: Manual (admin) or automatic
- **Actions**:
  - Find oldest unused image
  - Create game document
  - Mark image as "current"
  - Set 3-hour timer

### **2. `endGame`**
- **Purpose**: End an active game
- **Trigger**: Manual or automatic (when timer expires)
- **Actions**:
  - Mark game as "ended"
  - Mark image as "used"
  - Calculate results

### **3. `getCurrentGame`**
- **Purpose**: Get the currently active game
- **Trigger**: Frontend requests
- **Actions**:
  - Check for active game
  - Return game data or null
  - Auto-end expired games

### **4. `scheduleGame`**
- **Purpose**: Automatic game scheduling
- **Trigger**: Cron job (every 3 hours)
- **Actions**:
  - End expired games
  - Create new games if unused images available
  - Handle image rotation

### **5. `maybeStartGame` (NEW)**
- **Purpose**: Ensures a game is always running if possible
- **Trigger**: Called automatically after every image upload (admin)
- **Actions**:
  - Checks if an active game exists
  - If not, finds the oldest unused image
  - Creates a new game with that image
  - Marks the image as "current"
- **Notes**: This function is called by the frontend after a successful image upload, and acts as a real-time complement to the scheduled `scheduleGame` function. This ensures there is no downtime between games if new images are uploaded.

## 🕐 **Cron Job Setup**

### **Automatic Scheduling**
Set up a cron job to run `scheduleGame` every 3 hours:

1. **Go to Appwrite Console** → Functions → `scheduleGame`
2. **Click Settings** → Schedule
3. **Enter cron expression**: `0 */3 * * *`
4. **Save settings**

This ensures:
- ✅ Games end automatically after 3 hours
- ✅ New games start if unused images are available
- ✅ Image rotation happens automatically
- ✅ No manual intervention needed

## 🎮 **Frontend Components**

### **1. GameStatus Component**
- Shows current game with countdown timer
- Displays game image and statistics
- Shows "No games available" when no active game
- Real-time updates every 30 seconds

### **2. AdminUpload Component**
- Uploads images with answers
- **After every upload, calls `maybeStartGame` to check and start a new game if needed**
- Automatically triggers game creation if no active game
- Sets image permissions for public viewing

## 🔧 **Setup Instructions**

### **1. Deploy Functions**
```bash
cd appwrite
chmod +x deploy-functions.sh
./deploy-functions.sh
```

### **2. Set Environment Variables**
For each function, set these environment variables:
```
APPWRITE_ENDPOINT=your-endpoint
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
DATABASE_ID=685d619e00286d9805b7
IMAGES_COLLECTION_ID=images
GAMES_COLLECTION_ID=games
BUCKET_ID=images
```

### **3. Set Up Cron Job**
- Go to Appwrite Console
- Functions → `scheduleGame` → Settings
- Schedule: `0 */3 * * *`
- Save

### **4. Test the System**
1. **Upload images** via admin panel
2. **Check game creation** automatically
3. **Monitor countdown** timer
4. **Verify image rotation** after 3 hours

## 📱 **User Experience**

### **When Games Are Available**
- Users see current game image
- Real-time countdown timer
- Game statistics (bets, amounts)
- Progress bar showing time remaining

### **When No Games Available**
- Clear message: "No games currently available"
- Explanation: "Please wait for admin to upload new images"
- Option to manually try creating a game

## 🛡️ **Error Handling**

### **No Unused Images**
- System shows "No games available"
- Admin gets notification to upload more images
- Automatic retry every 3 hours

### **Game Expiration**
- Automatic detection of expired games
- Immediate marking as "ended"
- Image status updated to "used"

### **Network Issues**
- Graceful fallbacks for function calls
- Retry mechanisms for failed operations
- User-friendly error messages

## 🔄 **Image Status Flow**

```
Uploaded → "unused" → Assigned to Game → "current" → Game Ends → "used"
```

### **Status Meanings**
- **"unused"**: Available for new games
- **"current"**: Currently being used in active game
- **"used"**: Already used in a completed game

## 📈 **Monitoring & Analytics**

### **Game Statistics**
- Total bets per game
- Total amount bet
- Game duration tracking
- Image usage patterns

### **System Health**
- Number of unused images
- Active game status
- Automatic rotation success rate
- Error tracking and logging

## 🚀 **Deployment Checklist**

- [ ] Deploy all Appwrite functions
- [ ] Set environment variables
- [ ] Configure cron job schedule
- [ ] Test image upload flow
- [ ] Verify game creation
- [ ] Test countdown timer
- [ ] Check image rotation
- [ ] Monitor error handling

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Images not showing**
   - Check storage permissions
   - Verify file uploads succeeded
   - Check network connectivity

2. **Games not creating**
   - Verify unused images exist
   - Check function permissions
   - Review function logs

3. **Timer not working**
   - Check frontend JavaScript
   - Verify game end times
   - Test automatic expiration

### **Debug Commands**
```bash
# Check function logs
appwrite functions getLogs --functionId scheduleGame

# Test function manually
appwrite functions createExecution --functionId getCurrentGame
```

## 🎯 **Next Steps**

1. **Deploy the functions** using the provided script
2. **Set up the cron job** for automatic scheduling
3. **Test the complete flow** with sample images
4. **Monitor the system** for the first few cycles
5. **Adjust timing** if needed (currently 3 hours)

The system is now ready for production use with automatic game scheduling and image rotation! 🎉 