// src/components/ui/Spinner.jsx
const Spinner = ({ size = "md", text = "Loading..." }) => {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className={`${sizes[size]} border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-400 font-sans">{text}</p>}
    </div>
  );
};

export default Spinner;
