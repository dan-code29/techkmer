import { ReactNode } from 'react';

export const metadata = {
  robots: 'noindex, nofollow',
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}