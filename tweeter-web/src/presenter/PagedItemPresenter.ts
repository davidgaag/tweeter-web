import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
   addItems: (items: T[]) => void;
   setHasMoreItems: (hasMore: boolean) => void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<PagedItemView<T>> {
   private _service: U;
   private _hasMoreItems = true;
   private _lastItem: T | null = null;

   public constructor(view: PagedItemView<T>) {
      super(view);
      this._service = this.createService();
   }

   protected get service() {
      return this._service;
   }

   public get hasMoreItems() {
      return this._hasMoreItems;
   }

   protected set hasMoreItems(value: boolean) {
      this._hasMoreItems = value;
      this.view.setHasMoreItems(value);
   }

   protected get lastItem(): T | null {
      return this._lastItem;
   }

   protected set lastItem(item: T | null) {
      this._lastItem = item;
   }

   public async loadMoreItems(authToken: AuthToken, user: User) {
      this.doFailureReportingOperation(async () => {
         if (this.hasMoreItems) {
            let [newItems, hasMore] = await this.getMoreItems(authToken, user);
            console.log("New items: ", newItems);
            this.hasMoreItems = hasMore;
            this.lastItem = newItems[newItems.length - 1];
            console.log("Last item: ", this.lastItem);
            this.view.addItems(newItems);
         }
      }, this.getItemDescription());
   };

   public reset() {
      this.hasMoreItems = true;
      this.lastItem = null;
   }

   protected abstract createService(): U;
   protected abstract getMoreItems(authToken: AuthToken, user: User): Promise<[T[], boolean]>;
   protected abstract getItemDescription(): string;
}


