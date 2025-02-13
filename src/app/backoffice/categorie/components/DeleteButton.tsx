interface DeleteButtonProps {
  onDelete: () => void;
  label?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  label = "Supprimer",
}) => (
  <div
    onClick={onDelete}
    className="flex w-full items-center justify-center rounded-md px-8 py-3 text-white bg-red-300 hover:bg-red-500 cursor-pointer focus:ring-2 focus:ring-indigo-500"
  >
    {label}
  </div>
);

export default DeleteButton;
