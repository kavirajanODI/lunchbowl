import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useRegistration from "@hooks/useRegistration";
import { useSession } from "next-auth/react"; // Assuming you're using next-auth
import lunchbowlloader from "../../../public/lunch-bowl-loader.gif";
import Image from "next/image";

const DataRoutingPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { submitHandler, loading, error } = useRegistration();

  useEffect(() => {
    // Only proceed if we have a session and the user is authenticated
    if (status === "loading") return; // Still loading session
    if (status === "unauthenticated") {
      router.push('/login'); // Redirect if not authenticated
      return;
    }

    console.log({ path: 'Step-Check', _id: session.user.id });

    const fetchDataAndRoute = async () => {
      try {
        if (!session?.user?.id) {
          throw new Error("User ID not available");
        }

        // Call your submitHandler with the user's ID
        const result = await submitHandler({
            path: 'Step-Check', // Adjust the path as needed
          _id: session?.user?.id, // Using the user ID from session
        });
        console.log('====================================');
        console.log('Step Check Result------>:', result?.data?.step);
        console.log('====================================');
        // Assuming result is already the parsed response
        // Adjust this condition based on your actual API response structure
        if (result?.data?.step == 4) {
          router.push('/user/menuCalendarPage');
        } else {
          router.push('/user/profile-Step-Form');
        }
      } catch (error) {
        console.error('Error:', error);
        //router.push('/error'); // Or show error in UI
      }
    };

    fetchDataAndRoute();
  }, [router, status, session]); // Add dependencies

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (

    <div className='ProcessingMBox'>
      <h2>Processing your request...</h2>
      <div className='lbowlLoadBox'>
        <Image src={lunchbowlloader} priority alt="Icon" className="lbowlLoadimg" />
      </div>
    </div>
  );
};

export default DataRoutingPage;