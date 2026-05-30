import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = await params;
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <ResetPasswordForm token={token} />
    </Suspense>
  );
}