import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model-service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserInfoNavigationView extends View {
   setDisplayedUser: (user: User) => void;
}

export class UserInfoNavigationPresenter extends Presenter<UserInfoNavigationView> {
   private service: UserService;

   public constructor(view: UserInfoNavigationView) {
      super(view);
      this.service = new UserService();
   }

   public async navigateToUser(authToken: AuthToken, currentUser: User, aliasContext: string,) {
      this.doFailureReportingOperation(async () => {
         let alias = this.extractAlias(aliasContext);

         let user = await this.service.getUser(authToken!, alias);

         if (!!user) {
            if (currentUser!.equals(user)) {
               this.view.setDisplayedUser(currentUser!);
            } else {
               this.view.setDisplayedUser(user);
            }
         }
      }, "get user");
   };

   private extractAlias = (value: string): string => {
      let index = value.indexOf("@");
      return value.substring(index);
   };
}