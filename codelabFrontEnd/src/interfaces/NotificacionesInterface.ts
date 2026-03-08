export interface NotificationStateInterface {
  isVisible: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
}

export const NotificacionData: NotificationStateInterface = {
  isVisible: false,
  variant: "success",
  title: "",
  message: "",
};
