"use client";
import { useState, useEffect } from "react";
import UserInfo from "@/components/User/UserInfo";
import UserDisplay from "@/components/User/UserDisplay";
import Orders from "@/components/User/UserOrders";
import UserCart from "@/components/User/UserCart";
import useProvideAuth from "@/components/generalUtils/useAuth";
import BackOfficeLayout from "@/components/BackOffice/Office";
import { getUserProfileByUniqueId } from "@/utils/usersUtils";

const UserProfile = ({ params }) => {
  const { uniqueId } = params; // Unique ID from the URL
  const { user, admin, loading: authLoading } = useProvideAuth(); // Include loading state from the auth hook
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null); // Initialize as null to avoid premature access
  const [isPublic, setIsPublic] = useState(false); // Determine if the profile is public


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (authLoading) {
          // Wait until authentication loading is done
          return;
        }

        if (user && user.uniqueId === uniqueId) {
          // The profile is the authenticated user's own profile
          setIsPublic(false);
          setUserInfo(user);
        } else if (admin && admin.uniqueId === uniqueId) {
          // The profile is the authenticated admin's own profile
          setIsPublic(false);
          setUserInfo(admin);
        } else {
          // Neither user nor admin matches the uniqueId, fetch the profile
          const fetchedUserData = await getUserProfileByUniqueId(uniqueId);
          if (fetchedUserData) {
            setIsPublic(true); // Set as public profile
            setUserInfo(fetchedUserData);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    if (uniqueId) {
      fetchUserProfile();
    }
  }, [admin, uniqueId, user, authLoading]);

  if (loading || authLoading) {
    return <div className="max-[760px]:pt-20">Loading user</div>; // Show a loading indicator while fetching data
  }

  if (!userInfo) {
    return <div>User not found</div>; // Handle case where the user/admin profile isn't found
  }

  return (
    <main className="min-h-screen">
      {userInfo.role != "seller" && !isPublic ? (
        <>
          <UserInfo userInfo={userInfo} handleUpdate={setUserInfo} />
          <Orders orderIds={userInfo.orders || []} />
          <UserCart cartItems={userInfo.cart || []} />
        </>
      ) : userInfo.role === "seller" && !isPublic ? (
        <BackOfficeLayout user={userInfo} />
      ) : (
        isPublic && <UserDisplay userInfo={userInfo} />
      )}
    </main>
  );
};

export default UserProfile;
