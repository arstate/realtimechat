'use client';
import { useState, useEffect } from 'react';
import AdminPanel from './admin-panel';

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminPanel />;
}
