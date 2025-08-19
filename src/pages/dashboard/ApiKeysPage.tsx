import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Copy } from "lucide-react";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useState } from "react";
import { showError, showSuccess } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ApiKeysPage = () => {
  const { apiKeys, loading, error, createApiKey, deleteApiKey } = useApiKeys();
  const [newKeyName, setNewKeyName] = useState("");
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{key: string, name: string} | null>(null);
  const { toast } = useToast();

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      showError("请输入API密钥名称");
      return;
    }
    const token = localStorage.getItem('api_key');
    if (!token) {
      showError("请先登录");
      return;
    }
    try {
      const response = await createApiKey(newKeyName, token);
      setNewKeyName("");
      // 保存新创建的密钥信息
      setNewlyCreatedKey({key: response.key, name: response.name});
      // 显示对话框
      setShowKeyDialog(true);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "复制成功",
        description: "API密钥已复制到剪贴板",
      });
    }).catch(() => {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    });
  };

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
                <TableCell className="font-mono py-4">{apiKey.key_prefix + '****************'}</TableCell>
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

      {/* 显示新创建API密钥的对话框 */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent className="sm:max-w-md bg-[#1C1C1C] border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">API密钥已创建</DialogTitle>
            <DialogDescription className="text-gray-400">
              请妥善保管您的新API密钥
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            {newlyCreatedKey && (
              <>
                <div className="grid flex-1 gap-2">
                  <div className="text-sm font-medium text-white">密钥名称: {newlyCreatedKey.name}</div>
                  <div className="relative">
                    <Input
                      readOnly
                      value={newlyCreatedKey.key}
                      className="bg-[#2C2C2C] border-zinc-700 pr-10 font-mono"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-zinc-800"
                      onClick={() => copyToClipboard(newlyCreatedKey.key)}
                    >
                      <Copy className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="text-sm text-yellow-500 mt-2">
            密钥只展示这一次，请妥善保管。
          </div>
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => {
                if (newlyCreatedKey) {
                  copyToClipboard(newlyCreatedKey.key);
                }
                setShowKeyDialog(false);
              }}
              className="bg-white text-black hover:bg-gray-200"
            >
              复制并关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeysPage;