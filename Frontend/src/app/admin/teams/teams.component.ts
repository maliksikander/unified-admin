import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CommonService} from "../services/common.service";
import {MatDialog} from "@angular/material/dialog";
import {EndpointService} from "../services/endpoint.service";
import {SnackbarService} from "../services/snackbar.service";
import {ConfirmDialogComponent} from "../../shared/confirm-dialog/confirm-dialog.component";

@Component({
    selector: 'app-teams',
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
    p: any = 1;
    itemsPerPageList = [5, 10, 15];
    itemsPerPage = 5;
    selectedItem = this.itemsPerPageList[0];
    spinner: any = false;
    editData;
    dropdownList = [];
    selectedAgent = [];
    selectedSupervisor = [];
    teams = '';
    dropdownSettings = {};
    searchTerm = "";
    loginForm: FormGroup;

    formErrors = {
        name: "",
        description: "",
        type: "",
    };
    validations;
    attributeForm: FormGroup;
    formHeading = "Create Team";
    saveBtnText = "Add";
    teamData = [
        {
            "id": "6540acdaa9138a5942kke99790",
            "name": "Marketing",
            "availableAgents": 45,
            "defaultValue": 1,
            "createdOn": "2023-02-03T08:47:03.066+00:00",
            "supervisors": [{name: "john Hamilton"},{name:"Maggie Jons"},{name:"Jason Reeds"}],
        },{
            "id": "6540acdaa91a5942kke99790",
            "name": "Customer Support",
            "availableAgents": 36,
            "defaultValue": 1,
            "createdOn": "2023-04-03T08:47:03.066+00:00",
            "supervisors": [{name: "Andrew Trate"},{name:"Michal Jons"}],
        },{
            "id": "6540acdaa9138a5942k99790",
            "name": "Technical Support",
            "availableAgents": 23,
            "defaultValue": 1,
            "createdOn": "2023-04-03T08:47:03.066+00:00",
            "supervisors": [{name: "Poul Reeds"},{name:"Maggie Jons"},{name:"john Hamilton"}],
        },{
            "id": "6540acdaa9138a594ke99790",
            "name": "Business Management",
            "availableAgents": 14,
            "defaultValue": 1,
            "createdOn": "2023-05-03T08:47:03.066+00:00",
            "supervisors": [{name: "Michal Hanery"},{name:"ashley graham"}],
        },

    ];

    constructor(
        private commonService: CommonService,
        private dialog: MatDialog,
    ) {
    }
    ngOnInit(){
        this.dropdownList = [
            {"id":1,"agentName":"Ammamaria", "supervisor": "Ammamaria"},
            {"id":2,"agentName":"Jason Reeds", "supervisor": "Carmencita"},
            {"id":3,"agentName":"Maggie Jones", "supervisor": "Renato"},
            {"id":4,"agentName":"Adam Miller", "supervisor": "Jacqueminot Ruthen"},
            {"id":5,"agentName":"Andrew Trate" , "supervisor": "Beere Lymen"},
            {"id":6,"agentName":"Simon Lee" , "supervisor": "Cairistiona"},
            {"id":7,"agentName":"John Doe" , "supervisor": "Ruthen"},
            {"id":8,"agentName":"Jason Wright" , "supervisor": "Jacqueminot"},
        ];
        this.selectedAgent = [
            {"id":1,"agentName":"Ammamaria"},
            {"id":2,"agentName":"Jason Reeds"},
        ];
        this.selectedSupervisor = [
            {"id":2,"supervisor":"Carmencita"},
        ];
        this.dropdownSettings = {
            singleSelection: false,
            text:"",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            classes:"custom-class",
            badgeShowLimit: 3,
            searchPlaceholderText: 'Search agent(s)'


        };
    }


    addTeam(templateRef) {
        this.formHeading = 'Add Team'
        let dialogRef = this.dialog.open(templateRef, {
            width: "550px",
            panelClass: ["add-attribute", "add-team"],
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    editTeam(templateRef, data) {
        this.formHeading = 'Edit Team';
        this.saveBtnText = 'Update';
        this.teams = data.name;

        let dialogRef = this.dialog.open(templateRef, {
            width: "550px",
            panelClass: ["add-attribute", "add-team"],
            disableClose: true,
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    deleteConfirm(e) {
        let msg = `Are you sure you want to delete " ${e.name} " Team ?`;
        return this.dialog
            .open(ConfirmDialogComponent, {
                panelClass: ['confirm-dialog-container', 'delete-confirmation'],
                disableClose: true,
                data: {
                    heading: "Delete Team",
                    message: msg,
                    text: "confirm"
                },
            })
            .afterClosed()
            .subscribe((res: any) => {
            });
    }

    //save page number storage for reload
    pageChange(e) {
        sessionStorage.setItem("currentAttributePage", e);
    }

    //page bound change and saving for reload
    pageBoundChange(e) {
        this.p = e;
        sessionStorage.setItem("currentAttributePage", e);
    }

    selectPage() {
        this.itemsPerPage = this.selectedItem;
    }
    onClose() {
        this.dialog.closeAll();
    }


    onItemSelect(item:any){
        console.log(item);
        console.log(this.selectedAgent);
    }
    OnItemDeSelect(item:any){
        console.log(item);
        console.log(this.selectedAgent);
    }
    onSelectAll(items: any){
        console.log(items);
    }
    onDeSelectAll(items: any){
        console.log(items);
    }

}
