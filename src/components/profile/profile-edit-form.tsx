"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/profile";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function ProfileEditForm() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const technician = user!.technician;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: technician.name,
      phone: technician.phone,
      email: technician.email,
      address: technician.address ?? "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    const error = await updateProfile(values);
    if (error) {
      toast(error, "error");
      return;
    }
    toast("Profile updated successfully.", "success");
    router.push("/profile");
  };

  return (
    <Card className="shadow-none">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Phone"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Textarea
          label="Address"
          rows={3}
          error={errors.address?.message}
          {...register("address")}
        />
        <div className="flex gap-2 pt-2">
          <Button type="submit" loading={isSubmitting}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
