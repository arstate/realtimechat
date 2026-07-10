'use client';
import { useState, useEffect, use } from 'react';
import AdminPanel from '../admin-panel';

export default function AdminPreviewPage({ params }: { params: Promise<{ viewId: string }> }) {
  const [mounted, setMounted] = useState(false);
  const resolvedParams = use(params);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  const viewIdParam = resolvedParams?.viewId ? (Array.isArray(resolvedParams.viewId) ? resolvedParams.viewId[0] : resolvedParams.viewId) : '';
  const id = viewIdParam.startsWith('view-') ? viewIdParam.substring(5) : viewIdParam;
  
  return <AdminPanel initialPreviewId={id} />;
}
