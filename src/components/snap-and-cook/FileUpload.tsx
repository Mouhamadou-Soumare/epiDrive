type FileUploadProps = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  export function FileUpload({ onChange }: FileUploadProps) {
    return (
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Importer une image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none hover:border-indigo-500 transition-colors"
        />
      </div>
    );
  }