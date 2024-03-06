import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { verify, instance, mock, when } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
   it("has the login button disabled on first render", () => {
      const { signInButton } = renderLoginAndGetElements("/");
      expect(signInButton).toBeDisabled();
   });

   it("has the sign-in button enabled when both the alias and password fields have text", async () => {
      const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

      await typeIntoAliasAndPasswordFields("a", "b", aliasField, passwordField, user);

      expect(signInButton).toBeEnabled();
   });

   it("has the sign-in button disabled if either the alias or password field is cleared", async () => {
      const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

      await typeIntoAliasAndPasswordFields("a", "b", aliasField, passwordField, user);

      await user.clear(aliasField);
      expect(signInButton).toBeDisabled();

      await typeIntoAliasAndPasswordFields("c", "d", aliasField, passwordField, user);
      expect(signInButton).toBeEnabled();

      await user.clear(passwordField);
      expect(signInButton).toBeDisabled();
   });

   it("calls the presenter's login method when the sign-in button is pressed", async () => {
      const mockPresenter = mock<LoginPresenter>();
      const mockPresenterInstance = instance(mockPresenter);

      const originalUrl = "https://example.com";
      const alias = "@theAlias";
      const password = "thePassword";

      const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements(originalUrl, mockPresenterInstance);

      await typeIntoAliasAndPasswordFields(alias, password, aliasField, passwordField, user);

      await user.click(signInButton);

      verify(mockPresenter.doAuthentication(alias, password, originalUrl)).once();
   });
});

const typeIntoAliasAndPasswordFields = async (
   alias: string,
   password: string,
   aliasField: HTMLElement,
   passwordField: HTMLElement,
   user: UserEvent) => {
   await user.type(aliasField, alias);
   await user.type(passwordField, password);
}

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
   return render(
      <MemoryRouter>
         {!!presenter ? (
            <Login originalUrl={originalUrl} presenter={presenter} />
         ) : (
            <Login originalUrl={originalUrl} />
         )}
      </MemoryRouter>
   );
};

const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
   const user = userEvent.setup();

   renderLogin(originalUrl, presenter);

   const signInButton = screen.getByRole("button", { name: /Sign in/i });
   const aliasField = screen.getByLabelText("alias");
   const passwordField = screen.getByLabelText("password");

   return { signInButton, aliasField, passwordField, user };
};
