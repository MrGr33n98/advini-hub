# scripts/ec2-deploy.sh
#!/bin/bash

# EC2 Deployment Script for AdvocaciaHub

set -e  # Exit on any error

echo "Starting EC2 deployment for AdvocaciaHub..."

# Check if we're on the correct branch
if [[ $(git branch --show-current) != "main" ]]; then
  echo "Warning: Deployment should typically be done from the main branch"
fi

# Get EC2 instance details from environment
if [ -z "$EC2_PUBLIC_IP" ]; then
  echo "Error: EC2_PUBLIC_IP environment variable not set"
  exit 1
fi

if [ -z "$SSH_PRIVATE_KEY_PATH" ]; then
  echo "Error: SSH_PRIVATE_KEY_PATH environment variable not set"
  exit 1
fi

# Build frontend
echo "Building frontend..."
cd artifacts/advocacia-hub
npm ci
npm run build
cd ../..

# Build backend
echo "Building backend..."
cd backend_rails
bundle install --deployment --without development test
cd ..

# Create deployment package
echo "Creating deployment package..."
tar -czf advocaciahub-deployment-$(date +%s).tar.gz \
  artifacts/advocacia-hub/dist \
  backend_rails

DEPLOYMENT_FILE=$(ls advocaciahub-deployment-*.tar.gz | head -n 1)

# Copy files to EC2
echo "Copying files to EC2 instance..."
scp -i "$SSH_PRIVATE_KEY_PATH" -o StrictHostKeyChecking=no \
  "$DEPLOYMENT_FILE" \
  ubuntu@"$EC2_PUBLIC_IP":/home/ubuntu/

# Deploy on EC2
echo "Deploying on EC2 instance..."
ssh -i "$SSH_PRIVATE_KEY_PATH" -o StrictHostKeyChecking=no \
  ubuntu@"$EC2_PUBLIC_IP" << EOF
  set -e

  # Create deployment directory
  mkdir -p /home/ubuntu/advocaciahub-deployment
  cd /home/ubuntu/advocaciahub-deployment

  # Extract deployment package
  cp /home/ubuntu/$DEPLOYMENT_FILE .
  tar -xzf $DEPLOYMENT_FILE

  # Stop current services
  sudo systemctl stop advocaciahub-backend || echo "Backend service not running"
  sudo systemctl stop nginx || echo "Nginx not running"

  # Backup current version
  if [ -d "/opt/advocaciahub" ]; then
    TIMESTAMP=\$(date +%s)
    sudo mv /opt/advocaciahub "/opt/advocaciahub-backup-\$TIMESTAMP"
    echo "Backed up previous version to /opt/advocaciahub-backup-\$TIMESTAMP"
  fi

  # Create new application directory
  sudo mkdir -p /opt/advocaciahub
  sudo chown ubuntu:ubuntu /opt/advocaciahub

  # Deploy new version
  cp -r artifacts/advocacia-hub/dist/* /var/www/html/ || sudo mkdir -p /var/www/html
  cp -r backend_rails /opt/advocaciahub/backend

  # Setup backend
  cd /opt/advocaciahub/backend
  bundle install --deployment --without development test

  # Run database migrations
  export RAILS_ENV=production
  export DATABASE_URL=postgresql://advocaciahub:{{DB_PASSWORD}}@localhost/advocaciahub_production
  export REDIS_URL=redis://localhost:6379/0
  bundle exec rake db:migrate

  # Configure and start services
  sudo cp /opt/advocaciahub/backend/config/nginx.conf /etc/nginx/sites-available/default
  sudo systemctl reload nginx

  # Create systemd service file
  sudo tee /etc/systemd/system/advocaciahub-backend.service > /dev/null << SERVICE
[Unit]
Description=AdvocaciaHub Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/advocaciahub/backend
ExecStart=/home/ubuntu/.rbenv/shims/bundle exec rails server -p 3001
Restart=always
Environment=RAILS_ENV=production
Environment=DATABASE_URL=%i
Environment=REDIS_URL=redis://localhost:6379/0

[Install]
WantedBy=multi-user.target
SERVICE

  sudo systemctl daemon-reload
  sudo systemctl start advocaciahub-backend
  sudo systemctl enable advocaciahub-backend

  # Verify services are running
  if sudo systemctl is-active --quiet advocaciahub-backend && sudo systemctl is-active --quiet nginx; then
    echo "Deployment successful!"
    echo "Frontend: http://$EC2_PUBLIC_IP"
    echo "Backend: http://$EC2_PUBLIC_IP:3001"
  else
    echo "Error: Some services failed to start"
    exit 1
  fi

  # Cleanup
  cd ~
  rm -rf /home/ubuntu/advocaciahub-deployment
  rm /home/ubuntu/$DEPLOYMENT_FILE

  echo "Deployment completed successfully!"
EOF

# Cleanup local files
rm "$DEPLOYMENT_FILE"

echo "EC2 deployment completed!"