import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    onboardingComplete?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      onboardingComplete: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    onboardingComplete?: boolean;
  }
}
