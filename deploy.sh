#!/bin/bash

# Configuration
# Replace these with your actual details
ECS_USER="root"
ECS_HOST="47.238.70.55"
REMOTE_DIR="/var/www/guguk"

# Check if IP is provided
if [ "$ECS_HOST" == "your_ecs_ip_address" ]; then
    echo "Error: Please update the ECS_HOST variable in deploy.sh with your actual server IP."
    exit 1
fi

echo "Deploying to $ECS_USER@$ECS_HOST:$REMOTE_DIR..."

# 1. Copy files to ECS
echo "Syncing files..."
rsync -avz --exclude '.git' --exclude 'node_modules' . $ECS_USER@$ECS_HOST:$REMOTE_DIR

# 2. Build and Run Docker on ECS
echo "Building and restarting container..."
ssh $ECS_USER@$ECS_HOST << EOF
    cd $REMOTE_DIR
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        echo "Docker not found. Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        systemctl start docker
        systemctl enable docker
    fi

    # Stop and remove existing container if running
    docker stop guguk-web || true
    docker rm guguk-web || true
    
    # Build new image
    docker build -t guguk-web .
    
    # Run new container
    docker run -d -p 80:80 --name guguk-web --restart always guguk-web
EOF

echo "Deployment complete! Visit http://$ECS_HOST to see your website."
