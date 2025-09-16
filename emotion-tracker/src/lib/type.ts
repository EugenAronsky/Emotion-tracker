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
