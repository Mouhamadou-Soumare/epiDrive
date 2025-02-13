import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useEditProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setPreviewImage(session.user.image ? session.user.image : "/default-avatar.png");
    }
  }, [status, session, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const userId = session?.user?.id ? Number(session.user.id) : null;
      if (!userId) {
        throw new Error("User ID not found");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("userId", userId.toString());
      
      if (profileImage) {
        formData.append("file", profileImage);
      }
      
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        body: formData, 
      });      

      const data = await res.json();

      if (res.ok) {
        router.push("/profile");
      } else {
        setErrorMessage(data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      setErrorMessage("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    previewImage,
    isSubmitting,
    errorMessage,
    handleImageChange,
    handleSubmit,
  };
}
