'use client'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import {
    AccountBoxOutlined,
    AppsOutlined,
    BadgeOutlined,
    BusinessOutlined,
    DomainAddOutlined,
    DomainOutlined,
    DriveFileRenameOutlineOutlined,
    FactCheckOutlined,
    FormatListBulletedOutlined,
    GroupOutlined,
    HomeWorkOutlined,
    Inventory2Outlined,
    LanOutlined,
    LocalAtmOutlined,
    LocationOnOutlined,
    ManageAccountsOutlined,
    MoveToInboxOutlined,
    NoteAddOutlined,
    OutboxOutlined,
    PaidOutlined,
    PasswordOutlined,
    TypeSpecimenOutlined,
    WorkHistoryOutlined,
} from "@mui/icons-material";
import * as React from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import MenuGroup from "@/components/MenuGroup";
import PermissionCheck from "./PermissionCheck";

// @ts-ignore
function createMenu(
    name: string,
    icon: OverridableComponent<any>,
    path: string,
    permission: string,
    children?: any[{ name: string; icon: OverridableComponent<any>; path: string; permission: string; }]
) {
    return { name, icon, path, permission, children };
}

export default function DrawerMenu() {
    const menu = [
        createMenu("Dashboard", AppsOutlined, "/app", "app.view"),
        createMenu('Create Package', NoteAddOutlined, '/app/create-package', 'package.create'),
        createMenu('Packages', Inventory2Outlined, '/app/packages', 'package.view'),
        createMenu('Branches', DomainOutlined, '/app/branches', 'branch.view'),
        createMenu('Service', FactCheckOutlined, '/app/Services', 'service.view', [
            createMenu('Service Type', TypeSpecimenOutlined, '/app/ServiceType', 'service.view'),
            createMenu('Services Manager', LanOutlined, '/app/Services', 'service.view')
        ]),
        createMenu('Locations', LocationOnOutlined, '/app/Locations', 'locations.view'),
        createMenu('Check Fee', PaidOutlined, '/app/Feecustom/checkfee', 'checkFee.view'),
        createMenu('Fee Custom', PaidOutlined, '/app/Feecustom', 'fee.view', [
            createMenu('List Fee', FormatListBulletedOutlined, '/app/Feecustom', 'fee.view'),
            createMenu('Manager Fee', LocalAtmOutlined, '/app/Feecustom/Manager', 'fee.create')
        ]),
        createMenu('Profile', AccountBoxOutlined, '/app/user', 'user.view'),
        createMenu('Change Password', PasswordOutlined, '/app/user/change-password', 'password.change'),
        createMenu("Profile", AccountBoxOutlined, "/app/employee", "profile.view"),
        createMenu("Service", FactCheckOutlined, "/app/Services", "emp.view", [
            createMenu("Service Type", TypeSpecimenOutlined, "/app/ServiceType", "servicetype.view"),
            createMenu("Services Manager", LanOutlined, "/app/Services", "servicetype.view"),
        ]),
        createMenu("Locations", LocationOnOutlined, "/app/Locations", "locations.view"),
        createMenu("Check Fee", PaidOutlined, "/app/Feecustom/checkfee", "checkFee.view"),
        createMenu("Fee Custom", PaidOutlined, "/app/Feecustom", "feecustom", [
            createMenu("List Fee", FormatListBulletedOutlined, "/app/Feecustom", "fee.view"),
            createMenu("Manager Fee", LocalAtmOutlined, "/app/Feecustom/Manager", "fee.create"),
        ]),

        createMenu("User Management", GroupOutlined, "/app/admin/users", "emp.view"),
        createMenu("Employee Management", BadgeOutlined, "/app/admin/employees", "emp.view"),
        createMenu("Updated Requests", DriveFileRenameOutlineOutlined, "/app/admin/requests", "request.view"
        ),
        createMenu("Role Management", ManageAccountsOutlined, "/app/admin/roles", "role.view"
        ),

        createMenu("HistoryLogs", WorkHistoryOutlined, "/app/historylogs", ""),
        createMenu("Change Password", PasswordOutlined, "/app/user/change-password", "password.change"),
        createMenu("Addresses", BusinessOutlined, "/app/user/addresses", "addresses.view", [
            createMenu("Sender", OutboxOutlined, "/app/user/addresses/sender", "addresses.view"),
            createMenu("Receiver", MoveToInboxOutlined, "/app/user/addresses/receiver", "addresses.view"),
            createMenu("Add Address", DomainAddOutlined, "/app/user/add-address", "address.create"),
        ]),

        createMenu('News Management', NoteAddOutlined, '/app/news-management', 'new.create'),
        createMenu('General Settings', PasswordOutlined, '/app/general-settings', 'emp.create'),
    ]

    return (
        <div>
            <Toolbar></Toolbar>
            <Divider />
            <List>
                {menu.map((item, index) => (
                    <PermissionCheck
                        permission={item.permission}
                        key={index}>
                        <MenuGroup item={item}></MenuGroup>
                    </PermissionCheck>
                ))}
            </List>
        </div>
    );
}
