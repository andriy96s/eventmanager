import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AlertService} from "../../_services/alert.service";
import {WishListService} from "../../_services/wishlist.service";
import {Item} from "../../_models/wishList/item";
import {WishList} from "../../_models/wishList/wishList";
import {WishListItem} from "../../_models/wishList/wishListItem";
import {EventService} from "../../_services/event.service";
import {EventDTOModel} from "../../_models/dto/eventDTOModel";
import {Event} from "../../_models/event";
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'feature-copy-move',
  templateUrl: './copy-move.component.html',
  styleUrls: ['../wishlist/wishlist.component.css']
})
export class CopyMoveComponent implements OnChanges {
  @Input('copiedItem') inCopiedItem: Item;
  @Input('movableItem') inMovableItem: WishListItem;

  copiedItem: Item;
  movableItem: WishListItem;
  wishList: WishList;
  eventsDTO: EventDTOModel[];

  constructor(private eventService: EventService,
              private wishListService: WishListService,
              private alertService: AlertService) { }

  ngOnChanges(changes: SimpleChanges) {
    for (let prop in changes) {
      switch (prop) {
        case 'inCopiedItem' : {
          delete this.movableItem;
          this.copiedItem = changes[prop].currentValue;
          break;
        }
        case 'inMovableItem' : {
          delete this.copiedItem;
          this.movableItem = changes[prop].currentValue;
          break;
        }
      }
    }
    this.getMyEvents();
  }

  getMyEvents(): void {
    this.eventService.getEventsByCustId()
      .subscribe((eventsDTO) => {
          this.eventsDTO = eventsDTO;
      });
  }

  copyToEventWishList(event: Event): void {
    console.log(this.copiedItem);
    console.log(this.movableItem);
    let wishList = new WishList();
    let wishListItem: WishListItem = new WishListItem();
    wishListItem.item = new Item();
    wishListItem.item = this.movableItem ? this.movableItem.item : this.copiedItem;
    console.log(wishListItem.item);
    wishListItem.event_id = event.id;
    wishListItem.priority = 3;
    wishList.id = event.id;
    wishList.items = [wishListItem];

    this.wishListService.addItems(wishList)
      .subscribe(() => {
        if (this.copiedItem)
          this.alertService.success('Item successfully copied to wishlist!');
        else if (this.movableItem) {
          this.wishListService.removeItems([this.movableItem])
            .subscribe(() => {
              let s: Subscription = this.wishListService.wishList$.subscribe((wishList) => {
                this.wishList = wishList;
                let index = this.wishList.items.indexOf(this.movableItem);
                this.wishList.items.splice(index, 1);
              });
              s.unsubscribe();
              this.alertService.success('Item successfully moved to wishlist!')
            });
        }
      }, () => {
        this.alertService.error('Something wrong')
      });
  }

}
