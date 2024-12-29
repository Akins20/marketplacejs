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
  const { user, admin, loading: authLoading } = useProvideAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null); // Holds the user data
  const [isPublic, setIsPublic] = useState(false); // Flag for public profiles

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Wait for authentication to finish loading
        if (authLoading) return;

        // Determine if the profile belongs to the current user/admin or is public
        if (user?.uniqueId === uniqueId) {
          setUserInfo(user);
          setIsPublic(false);
        } else if (admin?.uniqueId === uniqueId) {
          setUserInfo(admin);
          setIsPublic(false);
        } else {
          const fetchedUserData = await getUserProfileByUniqueId(uniqueId);
          if (fetchedUserData) {
            setUserInfo(fetchedUserData);
            setIsPublic(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false); // Ensure loading is false regardless of success or error
      }
    };

    if (uniqueId) {
      fetchUserProfile();
    }
  }, [admin, uniqueId, user, authLoading]);

  // Show a loading indicator while fetching or authentication is in progress
  if (loading || authLoading) {
    return <div className="max-[760px]:pt-20">Loading user...</div>;
  }

  // Handle case where the user/admin profile isn't found
  if (!userInfo) {
    return <div>User not found</div>;
  }

  // Simplify rendering logic with clearer conditions
  const isSeller = userInfo.role === "seller";
  const isOwner = !isPublic; // Profile belongs to the authenticated user or admin

  return (
    <main className="min-h-screen">
      {isOwner ? (
        isSeller ? (
          // Render BackOfficeLayout for sellers
          <BackOfficeLayout user={userInfo} />
        ) : (
          // Render user info, orders, and cart for non-sellers
          <>
            <UserInfo userInfo={userInfo} handleUpdate={setUserInfo} />
            <Orders orderIds={userInfo.orders || []} />
            <UserCart cartItems={userInfo.cart || []} />
          </>
        )
      ) : (
        // Render public user display for non-owners
        <UserDisplay userInfo={userInfo} />
      )}
    </main>
  );
};

export default UserProfile;
