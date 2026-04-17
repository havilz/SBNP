import { apiClient } from "../../infrastructure/clients/api.client";

export const userService = {
  /**
   * Admin: Fetch all users.
   */
  async getAllUsers(): Promise<any[]> {
    try {
      const response = await apiClient.get("/users");
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("[UserService] Failed to fetch users:", error);
      throw error;
    }
  },

  /**
   * Admin: Create a new user.
   */
  async createUser(data: any): Promise<any> {
    try {
      const response = await apiClient.post("/users", data);
      return response.data;
    } catch (error) {
      console.error("[UserService] Failed to create user:", error);
      throw error;
    }
  },

  /**
   * Admin: Update an existing user.
   */
  async updateUser(id: number, data: any): Promise<any> {
    try {
      const response = await apiClient.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`[UserService] Failed to update user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Admin: Delete a user.
   */
  async deleteUser(id: number): Promise<any> {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`[UserService] Failed to delete user ${id}:`, error);
      throw error;
    }
  }
};
