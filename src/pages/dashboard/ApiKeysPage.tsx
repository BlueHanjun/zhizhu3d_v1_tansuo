import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Copy } from "lucide-react";
import { api } from "@/lib/api";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
}

const fetchApiKeys = async (): Promise<ApiKey[]> => {
  return api.get<ApiKey[]>('/api/keys');
};

const ApiKeysPage = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<{ name: string; key: string } | null>(null);

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: fetchApiKeys,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => api.post<{ name: string; key: string }, { name: string }>('/api/keys', { name }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      setGeneratedKey(data);
      setIsCreateDialogOpen(false);
      setNewKeyName("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (keyId: string) => api.delete(`/api/keys/${keyId}`),
    onSuccess: () => {
      showSuccess("API Key已删除。");
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      showError("密钥名称不能为空。");
      return;
    }
    createMutation.mutate(newKeyName);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("已复制到剪贴板！");
  };

  return (
    <div className="space-y-8 text-white">
      <Dialog open={!!generatedKey} onOpenChange={() => setGeneratedKey(null)}>
        <DialogContent className="bg-[#1C1C1C] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>API Key已创建</DialogTitle>
            <DialogDescription>
              请复制并妥善保管您的新API Key。这是您唯一一次看到完整密钥的机会。
            </DialogDescription>
          </DialogHeader>
          <div className="bg-[#2C2C2C] p-4 rounded-md font-mono text-sm flex items-center justify-between">
            <span>{generatedKey?.key}</span>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedKey?.key ?? '')}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setGeneratedKey(null)} className="bg-white text-black hover:bg-gray-200">我已保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-[#1C1C1C] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>创建新的API Key</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input
                id="name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="col-span-3 bg-[#2C2C2C] border-zinc-700"
                placeholder="例如：我的测试密钥"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateKey} disabled={createMutation.isPending} className="bg-white text-black hover:bg-gray-200">
              {createMutation.isPending ? "创建中..." : "创建"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            {isLoading ? (
              Array.from({ length: 1 }).map((_, i) => (
                <TableRow key={i} className="border-0">
                  <TableCell className="py-4"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="py-4 text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                </TableRow>
              ))
            ) : apiKeys && apiKeys.length > 0 ? (
              apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id} className="border-0 hover:bg-zinc-900">
                  <TableCell className="py-4">{apiKey.name}</TableCell>
                  <TableCell className="font-mono py-4">{apiKey.key_prefix}...</TableCell>
                  <TableCell className="py-4">{new Date(apiKey.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right py-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#1C1C1C] border-zinc-800 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                          <AlertDialogDescription>
                            此操作无法撤销。这将永久删除您的API Key，使用此Key的请求将立即失败。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent hover:bg-zinc-800">取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(apiKey.id)} className="bg-red-600 hover:bg-red-700">删除</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                  您还没有创建任何API Key。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline" className="bg-white text-black hover:bg-gray-200 rounded-md">创建API key</Button>
    </div>
  );
};

export default ApiKeysPage;