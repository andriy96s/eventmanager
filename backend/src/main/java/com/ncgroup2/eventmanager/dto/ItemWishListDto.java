package com.ncgroup2.eventmanager.dto;

import com.ncgroup2.eventmanager.entity.Item;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class ItemWishListDto {

    Item item;

    String item_wishlist_id;

    String event_wishlist_id;

    String event_id;

    String booker_customer_login;

    int priority;

    public ItemWishListDto() {

        this.item_wishlist_id = UUID.randomUUID().toString();

        this.event_wishlist_id = UUID.randomUUID().toString();

        this.priority = 1;
    }
}
