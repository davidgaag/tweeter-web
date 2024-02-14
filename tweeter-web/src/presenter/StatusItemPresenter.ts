import { AuthToken, Status, User } from "tweeter-shared";

export interface StatusItemView {
   addItems: (items: Status[]) => void;
   displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
   private _view: StatusItemView;
   private _hasMoreItems = true;

   public constructor(view: StatusItemView) {
      this._view = view;
   }

   protected get view() {
      return this._view;
   }

   public get hasMoreItems() {
      return this._hasMoreItems;
   }

   protected set hasMoreItems(value: boolean) {
      this._hasMoreItems = value;
   }

   abstract loadMoreItems(authToken: AuthToken, displayedUser: User): void;
}