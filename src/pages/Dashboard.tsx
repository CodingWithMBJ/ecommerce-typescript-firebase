import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import {
  deleteUserAccountAndProfile,
  getUserProfile,
  updateUserProfileData,
  type UserProfile,
} from "../services/userService";

const Dashboard = () => {
  const { user } = useUser();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const data = await getUserProfile(user.uid);

        if (data) {
          setProfile(data);
          setName(data.name || "");
          setAddress(data.address || "");
        } else {
          setProfile({
            uid: user.uid,
            email: user.email,
            name: "",
            address: "",
          });
        }
      } catch (error) {
        console.error(error);
        addToast("Failed to load profile", "error");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, addToast]);

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    try {
      setSaving(true);

      await updateUserProfileData({
        uid: user.uid,
        email: user.email,
        name,
        address,
      });

      setProfile({
        uid: user.uid,
        email: user.email,
        name,
        address,
      });

      addToast("Profile updated successfully", "success");
    } catch (error) {
      console.error(error);
      addToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.setItem("showLogoutToast", "true");
      addToast("Signing out...", "info");
      await signOut(auth);
    } catch (err) {
      addToast("Logout failed", "error");
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeletingAccount(true);

      await deleteUserAccountAndProfile(user);

      addToast("Account deleted successfully", "success");
      navigate("/login");
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/requires-recent-login") {
        addToast("Please log in again before deleting your account", "error");
      } else {
        addToast("Failed to delete account", "error");
      }
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loadingProfile) {
    return <p>Loading profile...</p>;
  }

  return (
    <section className="dashboard section">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <section className="profile-card">
        <h2>Your Profile</h2>

        <p>
          <strong>Email:</strong> {profile?.email || user?.email}
        </p>

        <form className="form" onSubmit={handleUpdateProfile}>
          <div className="form-container">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>

      <div className="dashboard-actions">
        <Link to="/orders" className="btn">
          View Order History
        </Link>

        <button type="button" className="btn" onClick={handleLogout}>
          Logout
        </button>

        <button
          type="button"
          className="btn danger"
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
        >
          {deletingAccount ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </section>
  );
};

export default Dashboard;
