import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model-service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

// TODO: M2B move this common code shared with FeedPresenter to ...
export class StoryPresenter extends StatusItemPresenter {
   private service: StatusService;

   private lastItem: Status | null = null;

   public constructor(view: StatusItemView) {
      super(view);
      this.service = new StatusService();
   }

   public async loadMoreItems(authToken: AuthToken, user: User) {
      try {
         if (this.hasMoreItems) {
            let [newItems, hasMore] = await this.service.loadMoreStoryItems(authToken, user, PAGE_SIZE, this.lastItem);

            this.hasMoreItems = hasMore;
            this.lastItem = newItems[newItems.length - 1];
            this.view.addItems(newItems);
         }
      } catch (error) {
         this.view.displayErrorMessage(
            `Failed to load story items because of exception: ${error}`
         );
      }
   };
}