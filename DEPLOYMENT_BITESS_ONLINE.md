# Deployment Guide for bitess.online

Follow these steps to connect your domain **`bitess.online`** to your Node.js E-Commerce server.

---

## Step 1: DNS Setup (Namecheap, GoDaddy, Cloudflare, etc.)

Log into your Domain Registrar (where you bought `bitess.online`) and add these DNS Records pointing to your VPS/Server IP Address:

| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `YOUR_VPS_PUBLIC_IP` | Automatic / 300s |
| **A Record** | `www` | `YOUR_VPS_PUBLIC_IP` | Automatic / 300s |

---

## Step 2: PM2 Process Manager Setup (Node.js Keep-Alive)

To ensure your Node.js backend runs 24/7 in production without stopping:

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Navigate to project folder
cd /path/to/aura-ecommerce

# 3. Start application with PM2
pm2 start server.js --name "bitess-online"

# 4. Enable auto-restart on server reboot
pm2 startup
pm2 save
```

---

## Step 3: Nginx Reverse Proxy Setup

Copy the provided [`nginx.conf`](file:///C:/Users/USER/.gemini/antigravity/scratch/aura-ecommerce/nginx.conf) to your Nginx sites directory:

```bash
# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/bitess.online

# Enable site link
sudo ln -s /etc/nginx/sites-available/bitess.online /etc/nginx/sites-enabled/

# Test syntax
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Step 4: Enable Free HTTPS/SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL Certificate for bitess.online
sudo certbot --nginx -d bitess.online -d www.bitess.online
```

Once completed, your e-commerce store will be live securely at **`https://bitess.online`**!
