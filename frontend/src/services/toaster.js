import { toast } from "react-toastify";

class ToasterService {
  theme = 'light';

  constructor(defaultPosition = toast.POSITION.BOTTOM_CENTER) {
    this.defaultPosition = defaultPosition;
  }

  setTheme(theme) {
    this.theme = theme;
  }

  error(message, toastId = undefined) {
    toast.error(message, {
      toastId,
      position: this.defaultPosition,
      theme: this.theme
    });
  }
}

export const toaster = new ToasterService();
export default ToasterService;