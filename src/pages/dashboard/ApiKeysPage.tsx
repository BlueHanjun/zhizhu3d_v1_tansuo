import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useState } from "react";
import { showError, showSuccess } from "@/utils/toast";

const ApiKeysPage = () => {
  const { apiKeys, loading, error, createApiKey, deleteApiKey } = useApiKeys();
  const [newKeyName, setNewKeyName] = useState("");

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      showError("请输入API密钥名称");
      return;
    }
    
    try {
      await createApiKey(newKeyName);
      setNewKeyName("");
      showSuccess("API密钥创建成功");
    } catch (error) {
      showError("API密钥创建失败");
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await deleteApiKey(id);
      showSuccess("API密钥删除成功");
    } catch (error) {
      showError("API密钥删除失败");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 text-white">
        <div>
          <h1 className="text-3xl font-bold">API keys</h1>
          <p className="text-gray-400 mt-2">请妥善保管您的API keys。</p>
        </div>
        <div className="flex justify-center items-center h-32">
          加载中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 text-white">
        <div>
          <h1 className="text-3xl font-bold">API keys</h1>
          <p className="text-gray-400 mt-2">请妥善保管您的API keys。</p>
        </div>
        <div className="flex justify-center items-center h-32 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold">API keys</h1>
        <p className="text-gray-400 mt-2">请妥善保管您的API keys。</p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-[#1C1C1C]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-zinc-800 hover:bg-transparent">
              <TableHead className="text-white">名称</TableHead>
              <TableHead className="text-white">Key</TableHead>
              <TableHead className="text-white">创建日期</TableHead>
              <TableHead className="text-right text-white">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id} className="border-0 hover:bg-zinc-900">
                <TableCell className="py-4">{apiKey.name}</TableCell>
                <TableCell className="font-mono py-4">{apiKey.key}</TableCell>
                <TableCell className="py-4">{new Date(apiKey.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right py-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-white"
                    onClick={() => handleDeleteApiKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="输入API密钥名称"
          className="bg-[#2C2C2C] border-zinc-700 max-w-xs"
        />
        <Button 
          onClick={handleCreateApiKey}
          className="bg-white text-black hover:bg-gray-200 rounded-md"
        >
          创建API key
        </Button>
      </div>
    </div>
  );
};

export default ApiKeysPage;