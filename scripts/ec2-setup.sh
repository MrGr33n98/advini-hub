# scripts/ec2-setup.sh
#!/bin/bash

# EC2 Setup Script for AdvocaciaHub

set -e  # Exit on any error

echo "Setting up EC2 instance for AdvocaciaHub..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "Installing essential packages..."
sudo apt install -y \
  postgresql \
  postgresql-contrib \
  redis-server \
  nginx \
  nodejs \
  npm \
  ruby-full \
  build-essential \
  libpq-dev \
  imagemagick \
  git \
  curl \
  wget \
  vim \
  htop \
  fail2ban

# Start and enable services
echo "Starting and enabling services..."
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl start redis-server
sudo systemctl enable redis-server
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Configure PostgreSQL
echo "Configuring PostgreSQL..."
sudo -u postgres createuser -P advocaciahub
sudo -u postgres createdb -O advocaciahub advocaciahub_production

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Setup application directory
echo "Setting up application directory..."
sudo mkdir -p /opt/advocaciahub
sudo chown ubuntu:ubuntu /opt/advocaciahub

# Setup Nginx configuration
echo "Setting up Nginx configuration..."
sudo tee /etc/nginx/sites-available/advocaciahub > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/advocaciahub /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl reload nginx

# Setup Ruby environment
echo "Setting up Ruby environment..."
curl -sSL https://get.rvm.io | bash -s stable
source /home/ubuntu/.rvm/scripts/rvm
rvm install 3.0.0
rvm use 3.0.0 --default

# Setup Node.js environment
echo "Setting up Node.js environment..."
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Setup application user and permissions
echo "Setting up application permissions..."
sudo useradd -r -s /bin/false advocaciahub || true
sudo mkdir -p /var/www/html
sudo chown -R ubuntu:ubuntu /var/www/html

echo "EC2 instance setup completed!"
echo "Next steps:"
echo "1. Deploy the application using the deployment script"
echo "2. Configure SSL certificate if needed"
echo "3. Set up monitoring and backups"