import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";

@Component({
    selector: 'app-logout',
    template: ''
})
export class LogoutComponent implements OnInit {
    constructor(private authenticationService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.authenticationService.logout();
    }
}