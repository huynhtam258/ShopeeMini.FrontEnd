import { PaginationQuery } from "./common";
import { NotificationType } from "./enums";

export interface NotificationQuery extends PaginationQuery {
  isRead?: boolean;
}

export interface NotificationDto {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId: number | null;
  createdAt: string;
}
