#!/bin/bash

# Setup Cron Job for Automatic Game Scheduling
# This script sets up a cron job to run every 3 hours

echo "🕐 Setting up automatic game scheduling..."

# Function ID for the scheduleGame function
SCHEDULE_FUNCTION_ID="scheduleGame"

# Create a cron job that runs every 3 hours
# Format: 0 */3 * * * (every 3 hours)
echo "📅 Creating cron job for game scheduling..."

# You can set this up in Appwrite Console:
# 1. Go to Functions > scheduleGame
# 2. Click on "Settings"
# 3. Set up a cron schedule: "0 */3 * * *"
# 4. This will run the function every 3 hours

echo "✅ Cron job setup instructions:"
echo ""
echo "📋 Manual Setup Steps:"
echo "1. Go to Appwrite Console > Functions"
echo "2. Find the 'scheduleGame' function"
echo "3. Click on 'Settings' tab"
echo "4. In 'Schedule' section, enter: 0 */3 * * *"
echo "5. Save the settings"
echo ""
echo "🔄 This will automatically:"
echo "   - Check for expired games every 3 hours"
echo "   - End expired games"
echo "   - Create new games if unused images are available"
echo "   - Mark images as used when games end"
echo ""
echo "🎮 Game Lifecycle:"
echo "   - New game created → Image marked as 'current'"
echo "   - Game runs for 3 hours"
echo "   - Game expires → Image marked as 'used'"
echo "   - Next game starts with next unused image"
echo ""
echo "⚠️  Important Notes:"
echo "   - Games will only be created if unused images are available"
echo "   - Admin uploads will trigger immediate game creation if no active game"
echo "   - Users will see 'No games available' when no unused images exist" 