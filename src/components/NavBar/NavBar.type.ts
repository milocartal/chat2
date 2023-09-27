import { type Conversation } from "@prisma/client";

export interface NavbarComponent {
  selected?: string;
  conv?: Conversation[];
}