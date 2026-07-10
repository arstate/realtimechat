'use client';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const AdminPanel = dynamic(() => import('../admin-panel'), { ssr: false });

export default function AdminPreviewPage() {
  const params = useParams();
  const viewIdParam = params?.viewId ? (Array.isArray(params.viewId) ? params.viewId[0] : params.viewId) : '';
  const id = viewIdParam.startsWith('view-') ? viewIdParam.substring(5) : viewIdParam;
  return <AdminPanel initialPreviewId={id} />;
}

