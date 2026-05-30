import ResetPasswordForm from './ResetPasswordForm';

interface ResetPasswordPageProps {
  params: { token: string };
}

export default function ResetPasswordTokenPage({ params }: ResetPasswordPageProps) {
  return <ResetPasswordForm token={params.token} />;
}
