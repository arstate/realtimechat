'use client';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const AdminPanel = dynamic(() => import('../admin-panel'), { ssr: false });

export default function AdminPreviewPage() {
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
  return <AdminPanel initialPreviewId={id} />;
}
