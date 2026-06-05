import { api } from "../lib/api";
import type { Profile, Skill, UpdateProfilePayload } from "../types/profile";

export const userService = {
  async getMe(): Promise<Profile> {
    const { data } = await api.get<Profile>("/users/me");
    return data;
  },

  async updateMe(payload: UpdateProfilePayload): Promise<Profile> {
    const { data } = await api.patch<Profile>("/users/me", payload);
    return data;
  },

  async getSkillCatalog(): Promise<Skill[]> {
    const { data } = await api.get<Skill[]>("/skills");
    return data;
  },

  async addSkill(name: string): Promise<Profile> {
    const { data } = await api.post<Profile>("/users/me/skills", { name });
    return data;
  },

  async removeSkill(skillId: string): Promise<Profile> {
    const { data } = await api.delete<Profile>(`/users/me/skills/${skillId}`);
    return data;
  },

  async uploadAvatar(file: File): Promise<Profile> {
    const form = new FormData();
    form.append("avatar", file);
    const { data } = await api.post<Profile>("/users/me/avatar", form);
    return data;
  },
};
