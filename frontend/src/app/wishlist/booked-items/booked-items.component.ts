import {Component, OnInit} from '@angular/core';
import {WishList} from "../../_models/wishlist";
import {AlertService} from "../../_services/alert.service";
import {WishListService} from "../../_services/wishlist.service";
import {Item} from "../../_models/item";

@Component({
  selector: 'app-bookeditems',
  templateUrl: './booked-items.component.html',
  styleUrls: ['../wishlist/wishlist.component.css']
})
export class BookedItemsComponent implements OnInit {
  wishList: WishList;
  hasChanges: boolean = false;
  items : Item[];
  path: string[] = ['name'];
  order: number = 1; // 1 asc, -1 desc;

  constructor(private wishListService: WishListService,
              private alertService : AlertService) {
  }

  ngOnInit() {
      this.getBookedItems();
  }

  getBookedItems(): void {
    this.wishListService.getBookedItems()
      .subscribe((wishList) => {
        this.wishList = wishList;

        if(this.wishList == null){
          this.alertService.info('Items not found',true);
        }
      });
  }

  sortItems(prop: string) {
    this.path = prop.split('.');
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

  update() : void{
    this.wishListService.update(this.wishList).subscribe(data => {

      this.alertService.success('Wishlist successfully updated!',
        true);
    });
  }
}