package com.ncgroup2.eventmanager.dao;

import com.ncgroup2.eventmanager.entity.Customer;

public interface CustomerDao {
    Customer getByLogin(String login);
    void edit(Customer customer);
}