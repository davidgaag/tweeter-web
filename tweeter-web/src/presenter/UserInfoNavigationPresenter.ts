import { AuthToken, User, FakeData } from "tweeter-shared";
import { UserService } from "../model-service/UserService";

export interface UserInfoNavigationView {
   setDisplayedUser: (user: User) => void;
   displayErrorMessage: (message: string) => void;
}

export class UserInfoNavigationPresenter {
   private service: UserService;
   private view: UserInfoNavigationView;

   public constructor(view: UserInfoNavigationView) {
      this.view = view;
      this.service = new UserService;
   }

   public async navigateToUser(authToken: AuthToken, currentUser: User, aliasContext: string,) {
      try {
         let alias = this.extractAlias(aliasContext);

         let user = await this.service.getUser(authToken!, alias);

         if (!!user) {
            if (currentUser!.equals(user)) {
               this.view.setDisplayedUser(currentUser!);
            } else {
               this.view.setDisplayedUser(user);
            }
         }
      } catch (error) {
         this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
      }
   }

   private extractAlias = (value: string): string => {
      let index = value.indexOf("@");
      return value.substring(index);
   };
}