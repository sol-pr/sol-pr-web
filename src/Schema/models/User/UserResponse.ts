import { User } from "@/Schema/User";

export interface UserResponse {
    isSuccessful: boolean;
    message: string;
    user: User | null;
}