import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { deleteUser, type User } from "firebase/auth";
import { db } from "./firebaseConfig";

export type UserProfile = {
  uid: string;
  email: string | null;
  name: string;
  address: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type CreateUserProfileInput = {
  uid: string;
  email: string | null;
  name?: string;
  address?: string;
};

type UpdateUserProfileInput = {
  uid: string;
  email?: string | null;
  name?: string;
  address?: string;
};

export const createUserProfile = async ({
  uid,
  email,
  name = "",
  address = "",
}: CreateUserProfileInput) => {
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    name,
    address,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
};

export const updateUserProfileData = async ({
  uid,
  email = null,
  name = "",
  address = "",
}: UpdateUserProfileInput) => {
  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      email,
      name,
      address,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const deleteUserAccountAndProfile = async (user: User) => {
  await deleteDoc(doc(db, "users", user.uid));
  await deleteUser(user);
};
