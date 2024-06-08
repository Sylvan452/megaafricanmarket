import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from './use-cart';

export const useAuth = () => {
  const router = useRouter();
  const { clearCart } = useCart();

  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!res.ok) throw new Error();
      clearCart();
      localStorage.removeItem('wishlist');

      toast.success('Signed out successfully');

      router.push('/sign-in');
      router.refresh();
    } catch (err) {
      toast.error("Couldn't sign out, please try again.");
    }
  };

  return { signOut };
};
