export type EmotionForm = {
  emotion: "Anger" | "Sadness" | "Disgust" | "Joy" | "Love";
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
  role: string;
};

export type InviteProps = {
  id: string;
  from: string;
  senderInfo: {
    name: string;
    picture: string;
  };
  to: string;
};

export type SenderInfo = {
  senderInfo: {
    name: string;
    picture: string;
    uid: string;
  };
};
