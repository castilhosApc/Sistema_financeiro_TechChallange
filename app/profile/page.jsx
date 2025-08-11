import { redirect } from 'next/navigation';
import { getCurrentUser } from '../actions/auth';
import UserProfileForm from '../components/auth/UserProfileForm';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return <UserProfileForm user={user} />;
}
