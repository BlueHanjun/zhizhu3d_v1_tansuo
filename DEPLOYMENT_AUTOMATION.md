# 自动化部署脚本使用说明

本项目包含一个自动化部署脚本 `deploy.sh`，可以自动完成项目的构建和部署到阿里云ECS服务器的整个流程。

## 脚本功能

1. 自动检查必要命令（npm, rsync）
2. 清理之前的构建文件
3. 安装项目依赖
4. 构建项目
5. 检查服务器连接
6. 上传文件到服务器
7. 重启服务器上的 Nginx 服务

## 使用前准备

### 1. 修改配置

在使用脚本之前，请根据您的实际情况修改脚本中的配置变量：

```bash
# 服务器IP地址
SERVER_IP="your-server-ip"

# 服务器用户名
USER="root"

# 服务器部署路径
REMOTE_PATH="/var/www/html"
```

### 2. 确保已安装必要工具

脚本需要以下工具，请确保它们已安装在您的本地环境中：

- Node.js 和 npm
- rsync
- SSH 客户端

在 Ubuntu/Debian 系统中安装命令：
```bash
sudo apt update
sudo apt install nodejs npm rsync openssh-client -y
```

在 macOS 系统中安装命令：
```bash
# 如果使用 Homebrew
brew install node rsync
```

### 3. 配置 SSH 免密登录

为了使脚本能自动上传文件到服务器，您需要配置 SSH 免密登录：

```bash
# 生成 SSH 密钥对（如果还没有的话）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 将公钥复制到服务器
ssh-copy-id root@your-server-ip
```

测试连接：
```bash
ssh root@your-server-ip
```

### 4. 确保服务器环境已配置

请确保您的服务器已完成以下配置：

1. 安装了 Nginx
2. 配置了正确的 Nginx 站点配置
3. 开放了必要的端口（80, 443）

参考 `DEPLOYMENT_ECS.md` 文件完成服务器环境配置。

## 使用方法

### 1. 给脚本添加执行权限

```bash
chmod +x deploy.sh
```

### 2. 运行脚本

```bash
./deploy.sh
```

### 3. 查看部署结果

脚本执行完成后，您可以通过访问服务器IP地址来查看部署结果：

```
http://your-server-ip
```

## 故障排除

### 权限问题

如果遇到权限问题，请检查：

1. 本地文件权限
2. 服务器文件权限
3. SSH 密钥权限

### 网络连接问题

如果脚本无法连接到服务器：

1. 检查服务器IP地址是否正确
2. 检查服务器防火墙设置
3. 确认服务器SSH服务是否运行

### 构建失败

如果项目构建失败：

1. 检查 `package.json` 中的构建脚本
2. 确认所有依赖已正确安装
3. 查看控制台输出的错误信息

## 自定义脚本

您可以根据需要修改脚本以适应不同的部署需求：

1. 修改构建命令
2. 添加额外的部署步骤
3. 更改文件上传路径
4. 添加更多的错误检查

## 注意事项

1. 请确保在生产环境中使用此脚本前进行充分测试
2. 脚本会删除服务器上目标目录的现有文件，请谨慎使用
3. 建议在非高峰时段执行部署操作
4. 定期备份重要数据