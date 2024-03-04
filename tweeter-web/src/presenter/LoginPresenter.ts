import { UserService } from "../model-service/UserService";
import { AuthenticationView, Presenter, View } from "./Presenter";

export class LoginPresenter extends Presenter<AuthenticationView> {
   private service: UserService;

   public constructor(view: AuthenticationView) {
      super(view);
      this.service = new UserService();
   }

   public async doLogin(alias: string, password: string, originalUrl?: string) {
      this.doFailureReportingOperation(async () => {
         let [user, authToken] = await this.service.login(alias, password);

         this.view.updateUserInfo(user, authToken);

         if (!!originalUrl) {
            this.view.navigate(originalUrl);
         } else {
            this.view.navigate("/");
         }
      }, "log user in");
   };
}