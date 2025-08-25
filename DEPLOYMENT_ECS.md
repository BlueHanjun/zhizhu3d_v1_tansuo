# 总结
先构建项目：
npm install
npm run build

再上传代码：
rsync -avz --delete dist/ root@114.55.226.87:/var/www/html/

最后重启Nginx：
先连上ssh：
ssh root@114.55.226.87
sudo systemctl restart nginx

# 项目部署到阿里云ECS服务器指南

本项目是一个基于React + Vite + TypeScript构建的静态网站，可以通过阿里云ECS服务器进行部署。以下是详细的部署步骤：

## 1. 准备工作

### 1.1 阿里云ECS服务器
- 购买阿里云ECS服务器（推荐Ubuntu 20.04/22.04或CentOS 7/8）
- 开放端口：80（HTTP）、443（HTTPS）、22（SSH）
- 获取服务器公网IP地址

### 1.2 域名（可选）
- 购买域名并完成备案（中国大陆服务器必需）
- 配置DNS解析到ECS服务器IP

## 2. 服务器环境配置

### 2.1 连接服务器
```bash
ssh root@your-server-ip
```

### 2.2 更新系统
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 2.3 安装Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

### 2.4 启动Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 3. 项目构建

### 3.1 本地构建项目
在本地开发环境中执行：
```bash
npm install
npm run build
```

### 3.2 验证构建结果
构建完成后，会在项目根目录生成`dist`文件夹，包含所有需要部署的静态资源：
```
dist/
├── assets/
├── favicon.ico
├── index.html
├── logo.png
└── ...
```

## 4. 部署到服务器

### 4.1 上传文件到服务器

#### 方法1：使用scp命令
```bash
# 上传dist文件夹到服务器
scp -r dist/* root@your-server-ip:/var/www/html/
```

#### 方法2：使用rsync命令（推荐）
```bash
# 同步文件到服务器
rsync -avz --delete dist/ root@114.55.226.87:/var/www/html/
```

#### 方法3：使用FileZilla等FTP工具
- 连接服务器
- 上传`dist`文件夹内容到`/var/www/html/`目录

### 4.2 配置Nginx

#### 4.2.1 创建Nginx配置文件
```bash
sudo nano /etc/nginx/sites-available/your-app
```

#### 4.2.2 添加配置内容
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/html;
    index index.html;

    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 处理React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头设置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 4.2.3 启用配置
```bash
# Ubuntu/Debian
# 检查软链接是否已存在，如果存在则删除
if [ -L /etc/nginx/sites-enabled/your-app ]; then
  sudo rm /etc/nginx/sites-enabled/your-app
fi

# 创建软链接
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# CentOS/RHEL
# 检查软链接是否已存在，如果存在则删除
if [ -L /etc/nginx/conf.d/your-app.conf ]; then
  sudo rm /etc/nginx/conf.d/your-app.conf
fi

# 创建软链接
sudo ln -s /etc/nginx/conf.d/your-app.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl reload nginx
```

## 5. HTTPS配置（可选但推荐）

### 5.1 安装Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install epel-release -y
sudo yum install certbot python3-certbot-nginx -y
```

### 5.2 获取SSL证书
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 5.3 自动续期
```bash
sudo crontab -e
# 添加以下行，每月续期
0 0 1 * * /usr/bin/certbot renew --quiet
```

## 6. 自动化部署脚本

创建自动化部署脚本`deploy.sh`：

```bash
#!/bin/bash

# 配置变量
SERVER_IP="your-server-ip"
USER="root"
REMOTE_PATH="/var/www/html"

# 构建项目
echo "Building project..."
npm run build

# 上传文件
echo "Uploading files to server..."
rsync -avz --delete dist/ $USER@$SERVER_IP:$REMOTE_PATH/

# 重启Nginx（可选）
echo "Restarting Nginx..."
ssh $USER@$SERVER_IP "sudo systemctl reload nginx"

echo "Deployment completed!"
```

使用方式：
```bash
chmod +x deploy.sh
./deploy.sh
```

## 7. 使用Docker部署（可选）

### 7.1 创建Dockerfile
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 7.2 创建nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 7.3 构建和运行
```bash
# 构建镜像
docker build -t your-app .

# 运行容器
docker run -d -p 80:80 --name your-app-container your-app
```

## 8. 验证部署

### 8.1 测试访问
- 浏览器访问：http://your-server-ip
- 如果使用域名：http://your-domain.com

### 8.2 检查服务状态
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查端口监听
sudo netstat -tlnp | grep :80

# 检查日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 9. 性能优化

### 9.1 启用压缩
确保Nginx配置中已启用gzip压缩（已在配置中包含）。

### 9.2 缓存策略
- 静态资源缓存1年
- HTML文件缓存较短时间

### 9.3 CDN加速（可选）
- 配置阿里云CDN加速
- 设置回源到ECS服务器

## 10. 监控和维护

### 10.1 设置监控
- 使用阿里云云监控服务
- 配置告警规则

### 10.2 定期更新
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新SSL证书
sudo certbot renew
```

## 故障排除

### 常见问题
1. **403 Forbidden**: 检查文件权限
2. **404 Not Found**: 检查Nginx配置中的路径
3. **502 Bad Gateway**: 检查Nginx服务状态
4. **Nginx服务无法启动**: 检查配置语法、端口占用和错误日志
5. **Nginx配置测试失败**: 检查配置文件引用的文件是否存在

### 解决方案
```bash
# 检查文件权限
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# 检查Nginx配置语法
sudo nginx -t

# 如果出现配置测试失败，检查nginx.conf中引用的文件是否存在
# 查看nginx.conf文件
sudo cat /etc/nginx/nginx.conf

# 检查sites-enabled目录中的文件
sudo ls -la /etc/nginx/sites-enabled/

# 如果发现引用了不存在的文件，删除错误的软链接
# sudo rm /etc/nginx/sites-enabled/light_api_cursor

# 重新创建正确的软链接
# sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/

# 查看Nginx服务状态
sudo systemctl status nginx

# 查看Nginx错误日志
sudo tail -n 50 /var/log/nginx/error.log

# 检查端口占用情况
sudo netstat -tuln | grep :80
sudo netstat -tuln | grep :443

# 如果端口被占用，查找并停止占用进程
# sudo lsof -i :80
# sudo kill -9 <PID>

# 重启Nginx
sudo systemctl restart nginx

# 如果仍然无法启动，检查systemd服务文件
# Ubuntu/Debian: /lib/systemd/system/nginx.service
# CentOS/RHEL: /usr/lib/systemd/system/nginx.service

# 重新加载systemd配置并启动Nginx
sudo systemctl daemon-reload
sudo systemctl start nginx
```

---

如需进一步帮助，请参考：
- [阿里云ECS官方文档](https://help.aliyun.com/product/25378.html)
- [Nginx官方文档](https://nginx.org/en/docs/)
- [Certbot官方文档](https://certbot.eff.org/)