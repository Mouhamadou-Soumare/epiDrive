// src/components/StatCard.tsx

import Link from 'next/link';

export default function StatCard({ title, value, link }: { title: string, value: number, link: string }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <Link href={link} className="truncate text-sm font-medium text-gray-500">
            {title}
            </Link>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {value}
            </dd>
      </div>
    );
  }
  