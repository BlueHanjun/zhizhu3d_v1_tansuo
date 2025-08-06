const ContactPage = () => {
  return (
    <div className="container mx-auto py-24 text-white text-center">
      <h1 className="text-4xl font-bold">联系我们</h1>
      <p className="mt-4 text-lg text-gray-300">
        您可以通过以下方式联系我们，我们会在第一时间回复您。
      </p>
      <div className="mt-12 space-y-4 text-lg">
        <p>
          <span className="font-semibold">邮箱:</span> contact@zhizhu3d.com
        </p>
        <p>
          <span className="font-semibold">电话:</span> +86 123 4567 8901
        </p>
      </div>
    </div>
  );
};

export default ContactPage;