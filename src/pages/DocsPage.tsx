import { useState } from "react";

const DocsPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center p-4 pt-24 pb-12 md:p-6 md:pt-24 md:pb-12">
      <div className="w-full h-full bg-zinc-900 flex items-center justify-center rounded-lg relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-100"></div>
          </div>
        )}
        <iframe
          src="https://fxnhbt6c1n.feishu.cn/wiki/space/7534718019357032452?ccm_open_type=lark_wiki_spaceLink&open_tab_from=wiki_home"
          title="Documentation"
          className={`h-full w-full border-0 rounded-lg transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error('Iframe failed to load:', e);
            setIsLoading(false);
          }}
        />
      </div>
    </div>
  );
};

export default DocsPage;