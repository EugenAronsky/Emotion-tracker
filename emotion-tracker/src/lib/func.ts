import * as htmlToImage from "html-to-image";
import { toast } from "sonner";

let isSharing = false;

const shareScreenshot = async (id: string) => {
  if (isSharing) return; // уже в процессе
  isSharing = true;
  try {
    const element = document.getElementById(id);
    if (!element) return;

    // Делаем скриншот DOM-элемента
    const dataUrl = await htmlToImage.toPng(element);
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "screenshot.png", { type: "image/png" });

    // Проверяем поддержку
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "My Emotion Calendar",
        text: "Check out my mood today! 🌈",
      });
    } else {
      alert("Sharing screenshots is not supported in this browser 😢");
    }
  } catch (err) {
    console.error("Share failed", err);
  } finally {
    isSharing = false; // снимаем блокировку
  }
};

const errorHandler = async (res: Response) => {
  if (!res.ok) {
    let errMsg = "Request failed";
    try {
      const errData = await res.json();
      errMsg = errData.error || JSON.stringify(errData);
    } catch {
      errMsg = await res.text();
    }
    throw new Error(errMsg); // <-- важно!
  }
  return res.json();
};

const errorToast = ({ message }: { message: string }) => {
  toast.error(message, {
    className: "!bg-red-500/50 !border-red-600 !backdrop-blur-sm",
    duration: 5000,
  });
};

export { errorHandler, errorToast, shareScreenshot };
