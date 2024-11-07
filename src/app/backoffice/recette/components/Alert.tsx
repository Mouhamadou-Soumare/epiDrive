interface AlertProps {
    message: string;
    type: 'success' | 'error';
  }
  
const Alert: React.FC<AlertProps> = ({ message, type }) => (
    <div
        className={`px-4 py-3 rounded relative mb-4 ${
        type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`}
        role="alert"
    >
        <span className="font-bold">{type === 'success' ? 'Succès!' : 'Erreur!'}</span>
        <span className="block sm:inline"> {message}</span>
    </div>
);

export default Alert;
  