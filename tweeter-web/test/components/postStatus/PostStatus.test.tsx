import React from "react";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { anything, capture, instance, mock, verify, when } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
   ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
   __esModule: true,
   default: jest.fn(),
}));

let mockAuthTokenInstance: AuthToken;
let mockUserInstance: User;

describe("PostStatus Component", () => {
   beforeAll(() => {
      let mockUser = mock<User>();
      mockUserInstance = instance(mockUser);

      let mockAuthToken = mock<AuthToken>();
      mockAuthTokenInstance = instance(mockAuthToken);

      (useUserInfo as jest.Mock).mockReturnValue({
         currentUser: mockUserInstance,
         authToken: mockAuthTokenInstance,
      });
   });

   it("has the post status and clear buttons disabled on first render", () => {
      const { postButton, clearButton } = renderPostStatusAndGetElements();
      expect(postButton).toBeDisabled();
      expect(clearButton).toBeDisabled();
   });

   it("has the post status and clear buttons enabled when the post field has text", async () => {
      const { postField, postButton, clearButton, user } = renderPostStatusAndGetElements();

      await typeIntoPostField("a", postField, user);

      expect(postButton).toBeEnabled();
      expect(clearButton).toBeEnabled();
   });

   it("has the post status and clear buttons disabled when the post field is cleared", async () => {
      const { postField, postButton, clearButton, user } = renderPostStatusAndGetElements();

      await typeIntoPostField("a", postField, user);

      await user.clear(postField);
      expect(postButton).toBeDisabled();
      expect(clearButton).toBeDisabled();

   });

   it("calls the presenter's submitPost method with the correct parameters when the post status " +
      "button is pressed", async () => {
         const mockPresenter = mock<PostStatusPresenter>();
         const mockPresenterInstance = instance(mockPresenter);

         const post = "the post";

         const { postButton, postField, user } = renderPostStatusAndGetElements(mockPresenterInstance);

         await typeIntoPostField(post, postField, user);

         await user.click(postButton);

         verify(mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)).once();
      });

   const typeIntoPostField = async (post: string, postField: HTMLElement, user: UserEvent) => {
      await user.type(postField, post);
   };
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
   return render(
      <MemoryRouter>
         {!!presenter ? (
            <PostStatus presenter={presenter}
            />) : (
            <PostStatus />
         )
         }
      </MemoryRouter>
   );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
   const user = userEvent.setup();

   renderPostStatus(presenter);

   const postField = screen.getByLabelText("post content");
   const postButton = screen.getByLabelText("post");
   const clearButton = screen.getByLabelText("clear");

   return { postField, postButton, clearButton, user };
};