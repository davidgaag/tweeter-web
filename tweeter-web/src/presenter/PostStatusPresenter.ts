import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model-service/StatusService";
import { Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
   setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
   private service: StatusService;

   public constructor(view: PostStatusView) {
      super(view);
      this.service = new StatusService();
   }

   public async submitPost(post: string, user: User, authToken: AuthToken) {
      this.doFailureReportingOperation(async () => {
         this.view.displayInfoMessage("Posting status...", 0);

         let status = new Status(post, user, Date.now());

         await this.service.postStatus(authToken, status);

         this.view.clearLastInfoMessage();
         this.view.setPost("");
         this.view.displayInfoMessage("Status posted!", 2000);
      }, "post the status");
   }
}