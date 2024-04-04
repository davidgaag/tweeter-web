import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { PagedItemPresenter, PagedItemView } from "../../presenter/PagedItemPresenter";

interface Props<T, U> {
   presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T, U>;
   itemComponentGenerator: (item: T) => JSX.Element;
}

export const ItemScroller = <T, U>(props: Props<T, U>) => {
   const { displayErrorMessage } = useToastListener();
   const [items, setItems] = useState<T[]>([]);
   const [hasMoreItems, setHasMoreItems] = useState(true);

   // Required to allow the addItems method to see the current value of 'items'
   // instead of the value from when the closure was created.
   const itemsReference = useRef(items);
   itemsReference.current = items;

   const { displayedUser, authToken } = useUserInfo();

   // Load initial items
   useEffect(() => {
      setItems([]);
      // Clear lastItem and hasMoreItems state in presenter
      presenter.reset();
      loadMoreItems();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [displayedUser]);

   const listener: PagedItemView<T> = {
      addItems: (newItems: T[]) =>
         setItems([...itemsReference.current, ...newItems]),
      setHasMoreItems: setHasMoreItems,
      displayErrorMessage: displayErrorMessage
   };

   const [presenter] = useState(props.presenterGenerator(listener));

   const loadMoreItems = async () => {
      presenter.loadMoreItems(authToken!, displayedUser!);
   };

   return (
      <div className="container px-0 overflow-visible vh-100">
         <InfiniteScroll
            className="pr-0 mr-0"
            dataLength={items.length}
            next={loadMoreItems}
            hasMore={hasMoreItems}
            loader={<h4>Loading...</h4>}
         >
            {items.map((item, index) => (
               <div
                  key={index}
                  className="row mb-3 mx-0 px-0 border rounded bg-white"
               >
                  {props.itemComponentGenerator(item)}
               </div>
            ))}
         </InfiniteScroll>
      </div>
   );
};