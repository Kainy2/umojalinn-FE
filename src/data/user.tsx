import { UmojaLinnUser } from "@/types/user";

export const MOCK_USER: UmojaLinnUser = {
  id: "user-001",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  alternativeEmail: null,
  role: "BUYER", // Assuming role could be "BUYER", "DESIGNER", or "ADMIN"
  gender: "Female",
  address: {
    zipCode: "100001",
    address: "123 Main Street",
    country: "Nigeria",
    state: "Lagos",
    city: "Ikeja",
  },
  tag: "fashion-lover",
  dateOfBirth: "1990-05-15", // Or you could use a Date object, e.g., new Date(1990, 4, 15)
  phoneNumber: "+2348034567890",
  profilePhotoUri: "https://picsum.photos/200",
  authProvider: "google", // or "facebook", "email", etc.
  buyerProfile: {
    id: "buyer-profile-001",
    userId: "user-001",
    profileStrength: 85,
    isAvailable: true,
    projectInvitations: [],
    user: null,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
  },
  designerProfile: null, // Assuming this user is not a designer
  verified: true,
  createdAt: "2025-01-01T10:00:00Z",
  updatedAt: "2025-01-01T10:00:00Z",
};
