# Welcome to your Dyad app

## 测试用量明细接口

有关用量明细接口的详细信息，请参阅 [用量明细接口文档](USAGE_DETAILS_API.md)。

本项目包含一个用于测试用量明细接口的脚本 `test-usage-api.mjs`。

### 如何运行测试

1. 确保你已经安装了项目依赖：
   ```
   npm install
   ```

2. 获取有效的API密钥：
   - 登录到应用的仪表板
   - 导航到API密钥管理部分
   - 创建一个新的API密钥或复制现有的密钥

3. 运行测试脚本：
   ```
   API_KEY=your_actual_api_key_here node test-usage-api.mjs
   ```

   将 `your_actual_api_key_here` 替换为你在步骤2中获取的实际API密钥。

### 测试脚本说明

测试脚本会调用 `/usage/summary` 接口，该接口需要以下参数：
- `period`: 时间周期，可以是 'daily', 'weekly', 或 'monthly'
- `date`: 查询的日期，格式为 'YYYY-MM'

默认情况下，测试脚本使用以下参数：
- period: 'monthly'
- date: '2023-01'

你可以根据需要修改这些参数。

### 使用自定义参数

默认情况下，测试脚本使用 `period=monthly` 和 `date=2023-01` 参数。要使用自定义参数运行测试，可以使用以下命令：
```
API_KEY=your_actual_api_key_here node test-usage-api.mjs daily 2023-01-01
```

这将使用 `period=daily` 和 `date=2023-01-01` 参数调用接口。