export type Permission = "observer" | "viewer" | "reader";
export type Emotion = "Anger" | "Sadness" | "Disgust" | "Joy" | "Love";

export type EmotionForm = {
  emotion: Emotion;
  description: string;
  intensity: number;
};

export type EmotionReturnProps = EmotionForm & {
  date: Date;
  createdAt: Date;
  uid: string;
  id: string;
};

export type CollaboratorForm = {
  email: string;
  permission: Permission;
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
