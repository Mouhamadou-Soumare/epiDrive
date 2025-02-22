interface AlertProps {
message: string;
type: "success" | "error" | "warning";
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
    const bgColor = {
        success: "bg-green-100 border-green-400 text-green-700",
        error: "bg-red-100 border-red-400 text-red-700",
        warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    };

    return (
        <div className={`${bgColor[type]} border px-4 py-3 rounded relative mb-4`} role="alert">
        <span className="font-bold">{type === "success" ? "Succès !" : type === "error" ? "Erreur !" : "Attention !"}</span>
        <span className="block sm:inline"> {message}</span>
        </div>
    );
};

export default Alert;
  