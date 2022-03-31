import { Component, OnInit } from "@angular/core";
import { MenuItem, User } from "../model/model";
import { AuthenticationService } from "../services/authentication.service";



@Component({
    selector: 'app-layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    user: User;
    menuItems: MenuItem[] = [];

    constructor(private authenticationService: AuthenticationService) {
        this.authenticationService.user.subscribe(x => {
            this.user = x;
            this.setupMenu();
        });

    }

    ngOnInit(): void {
        this.setupMenu();
    }

    setupMenu() {
        this.menuItems = [];
        if(this.user) {
            this.menuItems.push({
                label: 'Consumer Form',
                showOnDesktop: true,
                showOnMobile: false,
                showOnTablet: false,
                rLink: "multiForm"
            });
            this.menuItems.push({
                label: 'Table',
                showOnDesktop: true,
                showOnMobile: false,
                showOnTablet: false,
                rLink: "view-transaction"
            });
            this.menuItems.push({
                label: 'User Profile',
                showOnDesktop: false,
                showOnMobile: false,
                showOnTablet: false,
                rLink: "profile"
            });
            this.menuItems.push({
                label: 'Log Out',
                showOnDesktop: true,
                showOnMobile: true,
                showOnTablet: true,
                rLink: "logout"
            });
        }
    }

    logout() {
        this.authenticationService.logout();
    }

}