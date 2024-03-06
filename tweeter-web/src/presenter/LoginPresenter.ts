import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
   protected authenticate(
      alias: string,
      password: string,
      firstName?: string,
      lastName?: string,
      imageBytes?: Uint8Array) {
      return this.service.login(alias, password);
   }

   public navigate(originalUrl: string): void {
      if (!!originalUrl) {
         this.view.navigate(originalUrl);
      } else {
         this.view.navigate("/");
      }
   }

   public getAuthenticationDescription(): string {
      return "log user in";
   }
}