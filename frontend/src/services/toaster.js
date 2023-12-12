import { toast } from 'react-toastify';

class ToasterService {
  constructor(defaultPosition = toast.POSITION.BOTTOM_CENTER, theme = 'light') {
    this.defaultPosition = defaultPosition;
    this.theme = theme;
  }

  setTheme(theme) {
    this.theme = theme;
  }

  error(message, toastId = undefined) {
    toast.error(message, {
      toastId,
      position: this.defaultPosition,
      theme: this.theme,
    });
  }
}

export const toaster = new ToasterService();
export default ToasterService;
