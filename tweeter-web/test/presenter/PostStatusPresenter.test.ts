import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { StatusService } from "../../src/model-service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter"
import { AuthToken, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
   let mockPostStatusView: PostStatusView;
   let postStatusPresenter: PostStatusPresenter;
   let mockStatusService: StatusService;

   const post = "Hello, world!";
   const user = new User("First", "Last", "alias", "url");
   const authToken = new AuthToken("test", Date.now());

   beforeEach(() => {
      mockPostStatusView = mock<PostStatusView>();
      const mockPostStatusViewInstance = instance(mockPostStatusView);

      const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
      postStatusPresenter = instance(postStatusPresenterSpy);

      mockStatusService = mock<StatusService>();
      const mockStatusServiceInstance = instance(mockStatusService);

      when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);
   });

   it("tells the view to display a posting status message", async () => {
      await postStatusPresenter.submitPost(post, user, authToken);
      verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
   });

   it("calls postStatus on the post status service with the correct status string and auth token", async () => {
      await postStatusPresenter.submitPost(post, user, authToken);

      let [_, capturedStatus] = capture(mockStatusService.postStatus).last();
      verify(mockStatusService.postStatus(authToken, capturedStatus)).once();
   });

   it("upon sucessful status post, tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
      await postStatusPresenter.submitPost(post, user, authToken);

      verify(mockPostStatusView.clearLastInfoMessage()).once();
      verify(mockPostStatusView.setPost("")).once();
      verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

      verify(mockPostStatusView.displayErrorMessage(anything())).never();
   });

   it("upon unsucessful status post tells the view to display an error message and does not tell it to do the following: " +
      "clear the last info message, clear the post, and display a status posted message", async () => {
         const error = new Error("Status post unsuccessful.");
         when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

         await postStatusPresenter.submitPost(post, user, authToken);

         verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: Status post unsuccessful.")).once();

         verify(mockPostStatusView.clearLastInfoMessage()).never();
         verify(mockPostStatusView.setPost("")).never();
         verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
      });
});