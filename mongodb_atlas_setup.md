# MongoDB Atlas Free Tier Setup Guide

1. **Sign up for MongoDB Atlas**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Create a free account

2. **Create a Free Tier Cluster**:
   - Click "Build a Cluster"
   - Select "Shared" (Free) option
   - Choose a cloud provider (AWS, Google Cloud, or Azure) and region closest to your users
   - Click "Create Cluster"

3. **Configure Security**:
   - Create a database user: In Security → Database Access → Add New Database User
   - Username and password authentication
   - Give "Read and Write to Any Database" permissions
   - Network Access: Allow access from anywhere (for development) or specific IPs

4. **Get Connection String**:
   - Once cluster is created, click "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update .env file**:
   Replace the current MongoDB URI with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=finance_news
   COLLECTION_NAME=news_articles
   SCRAPE_INTERVAL=60  # in seconds
   ```
