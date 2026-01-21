import { Timestamp } from "@angular/fire/firestore";

export type UserDocument = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  createdAt: Timestamp;
};
