import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h2 className="text-3xl font-bold mb-4">Not Found</h2>
      <p className="text-gray-400 mb-8">Could not find requested resource</p>
      <Link href="/" className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-medium hover:bg-indigo-500 transition-colors">
        Return Home
      </Link>
    </div>
  );
}
