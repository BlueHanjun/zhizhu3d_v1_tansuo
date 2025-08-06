const DocsPage = () => {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center p-4 pt-24 pb-12 md:p-6 md:pt-24 md:pb-12">
      <div className="w-full h-full bg-zinc-900 flex items-center justify-center rounded-lg">
        <iframe
          src="https://fxnhbt6c1n.feishu.cn/wiki/space/7534718019357032452?ccm_open_type=lark_wiki_spaceLink&open_tab_from=wiki_home" // 这是一个占位符网址，您可以替换成您的文档地址
          title="Documentation"
          className="h-full w-full border-0 rounded-lg"
        />
      </div>
    </div>
  );
};

export default DocsPage;