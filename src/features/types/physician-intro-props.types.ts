import { getWebsiteData } from '@/lib/website/get-website-data';

// Get the exact return type of getWebsiteData().
export type WebsiteData = Awaited<ReturnType<typeof getWebsiteData>>;

// Keep only return types that contain a profile property.
type WebsiteDataWithProfile = Extract<
  NonNullable<WebsiteData>,
  { profile: unknown }
>;

// Get the actual profile type.
export type WebsiteProfile = WebsiteDataWithProfile['profile'];

// Get the credential array type, excluding null and undefined.
export type PhysicianCredentials = NonNullable<
  NonNullable<WebsiteProfile>['credential']
>;

// It tells TypeScript that the object can be accessed using string keys and that its values have the type unknown
export type PhysicianIntroProps = {
  [key: string]: unknown;

  audioUrls?: {
    profile: string;
    patientCare: string;
    credentials: string;
    locations: string;
  };

  websiteData?: WebsiteData;
};
