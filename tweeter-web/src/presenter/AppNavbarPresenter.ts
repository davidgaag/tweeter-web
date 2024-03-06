import { AuthToken } from "tweeter-shared";
import { UserService } from "../model-service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView {
   clearUserInfo: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
   private _service: UserService | null = null;

   public constructor(view: AppNavbarView) {
      super(view);
   }

   public get service() {
      if (this._service === null) {
         this._service = new UserService();
      }
      return this._service;
   }

   public async logOut(authToken: AuthToken) {
      this.view.displayInfoMessage("Logging Out...", 0);
      this.doFailureReportingOperation(async () => {
         await this.service.logout(authToken);

         this.view.clearLastInfoMessage();
         this.view.clearUserInfo();
      }, "log user out");
   }
}