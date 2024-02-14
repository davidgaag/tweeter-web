import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model-service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

// TODO: M2B move this common code shared with FollowersPresenter to UserItemPresenter
export class FollowingPresenter extends UserItemPresenter {
   private service: FollowService;

   private lastItem: User | null = null;

   public constructor(view: UserItemView) {
      super(view);
      this.service = new FollowService();
   }

   public async loadMoreItems(authToken: AuthToken, user: User) {
      try {
         if (this.hasMoreItems) {
            let [newItems, hasMore] = await this.service.loadMoreFollowees(authToken, user, PAGE_SIZE, this.lastItem);

            this.hasMoreItems = hasMore;
            this.lastItem = newItems[newItems.length - 1];
            this.view.addItems(newItems);
         }
      } catch (error) {
         this.view.displayErrorMessage(
            `Failed to load followee because of exception: ${error}`
         );
      }
   };
}