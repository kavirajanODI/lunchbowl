export interface UserInterface {
  _id?: string;
  username: string;
  name: string;
  fullname: string;
  email: string;
  password: string;
  role_id: string;
  profile_setup_completed: boolean;
  profile: any;
  settings: any;
  agreements: any;
  status: string;
  deactivated_at: Date | null;
  deleted_at: Date | null;
  is_verified: boolean;
  failed_login_attempts: number;
  account_locked: boolean;
  custom_metadata: any;
  resetPasswordToken: string | null;
  tempResetToken: string | null;
  resetPasswordExpires: Date | null;
}
