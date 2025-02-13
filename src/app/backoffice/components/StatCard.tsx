import Link from "next/link";

interface StatCardProps {
  title: string;
  value?: number;
  link: string;
}

export default function StatCard({ title, value = 0, link }: StatCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <dl>
        <dt className="truncate text-sm font-medium text-gray-500">
          <Link href={link} aria-label={`Voir les détails de ${title}`} className="hover:underline">
            {title}
          </Link>
        </dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {value.toLocaleString()} {/* Formatage du nombre */}
        </dd>
      </dl>
    </div>
  );
}
