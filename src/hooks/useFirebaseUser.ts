// Import User type
import { firebaseAuth } from '../utils/fastAuth/firebase';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

function useFirebaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((data) => {
      setUser(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user, loading };
}

export default useFirebaseUser;
