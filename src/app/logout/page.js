'use client';

import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/'); // Chuyển hướng về Homepage
  };

  return (
    <div>
      <h1>Are you sure you want to logout?</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
