import useUserInfo from "./UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { UserInfoNavigationPresenter, UserInfoNavigationView } from "../../presenter/UserInfoNavigationPresenter";

interface UserInfoNavigator {
   navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserInfoNavigator = (): UserInfoNavigator => {
   const { displayErrorMessage } = useToastListener();
   const { setDisplayedUser, currentUser, authToken } = useUserInfo();

   const listener: UserInfoNavigationView = {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage: displayErrorMessage
   }

   const presenter = new UserInfoNavigationPresenter(listener);

   const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();

      // TODO: can we be sure that authToken and currentUser are both not null?
      await presenter.navigateToUser(authToken!, currentUser!, event.target.toString());
   };

   return {
      navigateToUser,
   };
};

export default useUserInfoNavigator;