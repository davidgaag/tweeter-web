import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { UserService } from "../../src/model-service/UserService";

describe("AppNavbarPresenter", () => {
   let mockAppNavbarView: AppNavbarView;
   let appNavbarPresenter: AppNavbarPresenter;
   let mockUserService: UserService;

   const authToken = new AuthToken("test", Date.now());

   beforeEach(() => {
      mockAppNavbarView = mock<AppNavbarView>();
      const mockAppNavbarViewInstance = instance(mockAppNavbarView);

      const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance));
      appNavbarPresenter = instance(appNavbarPresenterSpy);

      mockUserService = mock<UserService>();
      const mockUserServiceInstance = instance(mockUserService);

      when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
   });

   it("tells the view to display a logging out message", async () => {
      await appNavbarPresenter.logOut(authToken);
      verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
   });

   it("calls logout on the user service with the correct auth token", async () => {
      await appNavbarPresenter.logOut(authToken);
      verify(mockUserService.logout(authToken)).once();

      // Example of how to capture the used authToken
      // let [capturedAuthToken] = capture(mockUserService.logout).last();
      // expect(capturedAuthToken).toEqual(authToken);
   });

   it("when the logout is sucessful, tells the view to clear the last info message, clear the user info, and navigate to the login page", async () => {
      await appNavbarPresenter.logOut(authToken);

      verify(mockAppNavbarView.clearLastInfoMessage()).once();
      verify(mockAppNavbarView.clearUserInfo()).once();
      // TODO: No navigateToLogin() on the View
      // verify(mockAppNavbarView.navigateToLogin()).once();

      verify(mockAppNavbarView.displayErrorMessage(anything())).never();
   });

   it("when the logout is unsucessful, tells the view to display an error message and does not tell it to clear " +
      "last info message, clear user info, or navigate to the login page", async () => {
         const error = new Error("Logout unsuccessful.");
         when(mockUserService.logout(authToken)).thenThrow(error);

         await appNavbarPresenter.logOut(authToken);

         verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: Logout unsuccessful.")).once();

         verify(mockAppNavbarView.clearLastInfoMessage()).never();
         verify(mockAppNavbarView.clearUserInfo()).never();
         // TODO: No navigateToLogin() on the View
         // verify(mockAppNavbarView.navigateToLogin()).never();
      });
});