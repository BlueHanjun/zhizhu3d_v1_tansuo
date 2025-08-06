import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const apiKeys = [
  {
    name: "use_agent",
    key: "zz-sh234ncih3b4j45j424b45j3j42m45233m5",
    created: "2025-8-5",
  },
];

const ApiKeysPage = () => {
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
              <TableRow key={apiKey.name} className="border-0 hover:bg-zinc-900">
                <TableCell className="py-4">{apiKey.name}</TableCell>
                <TableCell className="font-mono py-4">{apiKey.key}</TableCell>
                <TableCell className="py-4">{apiKey.created}</TableCell>
                <TableCell className="text-right py-4">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Button variant="outline" className="bg-white text-black hover:bg-gray-200 rounded-md">创建API key</Button>
    </div>
  );
};

export default ApiKeysPage;