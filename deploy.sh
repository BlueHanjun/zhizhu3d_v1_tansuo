#!/bin/bash

# 项目自动化部署脚本
# 作者: Assistant
# 日期: 2024

# 配置变量 (请根据实际情况修改)
SERVER_IP="114.55.226.87"
USER="root"
REMOTE_PATH="/var/www/html"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要命令是否存在
check_commands() {
    print_info "检查必要命令..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装，请先安装 Node.js 和 npm"
        exit 1
    fi
    
    if ! command -v rsync &> /dev/null; then
        print_error "rsync 未安装，请先安装 rsync"
        exit 1
    fi
    
    print_info "所有必要命令检查通过"
}

# 构建项目
build_project() {
    print_info "开始构建项目..."
    
    # 清理之前的构建
    if [ -d "dist" ]; then
        print_info "清理之前的构建文件..."
        rm -rf dist
    fi
    
    # 安装依赖
    print_info "安装项目依赖..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "依赖安装失败"
        exit 1
    fi
    
    # 构建项目
    print_info "构建项目..."
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "项目构建失败"
        exit 1
    fi
    
    # 检查构建结果
    if [ ! -d "dist" ]; then
        print_error "构建失败，未找到 dist 目录"
        exit 1
    fi
    
    print_info "项目构建成功"
}

# 上传文件到服务器
upload_files() {
    print_info "开始上传文件到服务器..."
    
    # 检查服务器连接
    print_info "检查服务器连接..."
    ssh -o ConnectTimeout=10 $USER@$SERVER_IP "echo '连接成功'" > /dev/null 2>&1
    
    if [ $? -ne 0 ]; then
        print_error "无法连接到服务器，请检查服务器IP和SSH配置"
        exit 1
    fi
    
    # 上传文件
    print_info "上传文件到服务器 ($SERVER_IP:$REMOTE_PATH)..."
    rsync -avz --delete --progress dist/ $USER@$SERVER_IP:$REMOTE_PATH/
    
    if [ $? -ne 0 ]; then
        print_error "文件上传失败"
        exit 1
    fi
    
    print_info "文件上传成功"
}

# 重启Nginx服务
restart_nginx() {
    print_info "重启服务器上的 Nginx 服务..."
    
    ssh $USER@$SERVER_IP "sudo systemctl reload nginx"
    
    if [ $? -ne 0 ]; then
        print_warning "Nginx 重启失败，可能需要手动重启"
    else
        print_info "Nginx 重启成功"
    fi
}

# 主函数
main() {
    print_info "开始执行自动化部署脚本"
    
    # 检查必要命令
    check_commands
    
    # 构建项目
    build_project
    
    # 上传文件
    upload_files
    
    # 重启Nginx
    restart_nginx
    
    print_info "自动化部署完成!"
    print_info "您可以通过访问 http://$SERVER_IP 来查看部署结果"
}

# 执行主函数
main