import { LoadMoreItemsRequest, LoginRequest, Status } from "tweeter-shared";
import { ServerFacade } from "../src/model/net/ServerFacade";
import { PostStatusPresenter, PostStatusView } from "../src/presenter/PostStatusPresenter";
import { anything, instance, mock, verify } from "ts-mockito";
import "isomorphic-fetch";

describe.only("StoryIntegration", () => {
   it("logs in a user, posts a status, verifies that the correct info message was displayed, " +
      "and retrieves the user's story to verify the status was posted correctly", async () => {
         // Login a user
         const serverFacade = new ServerFacade();
         const loginReq = new LoginRequest("test1", "password");
         const authRes = await serverFacade.login(loginReq);

         const authToken = authRes.token;
         expect(authRes.success).toBe(true);
         expect(authToken).toBeDefined();

         // Post a status from the user to the server
         const user = authRes.user;
         const status = new Status("Hello, world!", user, Date.now());

         const mockPostStatusView = mock<PostStatusView>();
         const mockPostStatusViewInstance = instance(mockPostStatusView);

         const postStatusPresenter = new PostStatusPresenter(mockPostStatusViewInstance);

         await postStatusPresenter.submitPost(status.post, user, authToken);

         // Verify that the "Successfully Posted!" message was displayed to the user
         // Need to sleep because we can't await the async doFailureReportingOperation call in submitPost
         await sleep(2000);
         verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

         // Retrieve the user's story from the server to verify that the new status was correctly 
         // appended to the user's story
         const loadMoreStoryItemsReq = new LoadMoreItemsRequest<Status>(authToken, user, 10, null);
         const storyRes = await serverFacade.loadMoreStoryItems(loadMoreStoryItemsReq);

         expect(storyRes.success).toBe(true);
         expect(storyRes.items).toBeDefined();
         const lastStatus = storyRes.items[storyRes.items.length - 1];
         expect(lastStatus.post).toBe(status.post);
         expect(lastStatus.user).toStrictEqual(status.user);
      });

   function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }
});