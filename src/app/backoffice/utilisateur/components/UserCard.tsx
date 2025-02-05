import Link from "next/link";
import { User } from "../../../../../types";
import { EyeIcon } from "@heroicons/react/24/outline";

interface UserCardProps {
  utilisateur: User;
}

const UserCard: React.FC<UserCardProps> = ({ utilisateur }) => (
  <div className="flex flex-col items-center sm:items-start">
    <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-200">
      <img
        alt={`Avatar de ${utilisateur.username}`}
        className="h-full w-full object-cover object-center"
      />
    </div>
    <div className="flex flex-col mt-4 ssm:mt-0 flex-1 text-sm w-full">
      <div className="font-bold text-gray-900 sm:flex sm:justify-between">
        <h5>{utilisateur.username}</h5>
      </div>
      <p className="text-gray-500 my-2">{utilisateur.email}</p>
      <Link href={`/backoffice/utilisateur/${utilisateur.id}`} className="whitespace-nowrap a-primary svg-hover">
      <EyeIcon className="h-6 w-6"/>

      </Link>
    </div>
  </div>
);

export default UserCard;
