import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import type { Profile, UpdateProfilePayload } from "../types/profile";

/**
 * React Query gives us caching, loading/error states, and automatic refetching
 * for free. We key the profile under ["me"]; mutations write the fresh profile
 * straight into that cache so the UI updates instantly without a refetch.
 */
const ME_KEY = ["me"] as const;

export function useProfile() {
  return useQuery({ queryKey: ME_KEY, queryFn: userService.getMe });
}

export function useSkillCatalog() {
  return useQuery({ queryKey: ["skills"], queryFn: userService.getSkillCatalog });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateMe(payload),
    onSuccess: (profile: Profile) => qc.setQueryData(ME_KEY, profile),
  });
}

export function useAddSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => userService.addSkill(name),
    onSuccess: (profile: Profile) => qc.setQueryData(ME_KEY, profile),
  });
}

export function useRemoveSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) => userService.removeSkill(skillId),
    onSuccess: (profile: Profile) => qc.setQueryData(ME_KEY, profile),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: (profile: Profile) => qc.setQueryData(ME_KEY, profile),
  });
}
