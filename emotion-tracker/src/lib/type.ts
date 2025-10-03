export type Permission = "observer" | "viewer" | "reader";
export type Mood = "Awful" | "Bad" | "Normal" | "Good" | "Excellent";

export type EmotionForm = {
  mood: Mood;
  emotion: string;
  intensity: number;
  description: string;
};

export type EmotionReturnProps = EmotionForm & {
  date: Date;
  createdAt: Date;
  uid: string;
  id: string;
};

export type InviteProps = {
  id: string;
  from: string;
  senderInfo: {
    name: string;
    picture: string;
    permission: Permission;
    email: string;
  };
  to: string;
};

export type SenderInfo = {
  uid: string;
  name: string;
  email: string;
  picture: string;
  permission: Permission;
};
