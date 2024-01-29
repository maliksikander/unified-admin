import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CommonService} from "../services/common.service";
import {MatDialog} from "@angular/material/dialog";
import {EndpointService} from "../services/endpoint.service";
import {SnackbarService} from "../services/snackbar.service";
import {ConfirmDialogComponent} from "../../shared/confirm-dialog/confirm-dialog.component";
interface Supervisor {
    value: string;
    viewValue: string;
}
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
    secondarySupervisor = [];
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
            'id': '6540acdaa9138a5942kke99790',
            'name': 'Marketing',
            'availableAgents': 45,
            'defaultValue': 1,
            'createdOn': '2023-02-03T08:47:03.066+00:00',
            'supervisors': [{name: 'john Hamilton'}, {name: 'Maggie Jons'}, {name: 'Jason Reeds'}],
        }, {
            'id': '6540acdaa91a5942kke99790',
            'name': 'Customer Support',
            'availableAgents': 36,
            'defaultValue': 1,
            'createdOn': '2023-04-03T08:47:03.066+00:00',
            'supervisors': [{name: 'Andrew Trate'}, {name: 'Michal Jons'}],
        }, {
            'id': '6540acdaa9138a5942k99790',
            'name': 'Technical Support',
            'availableAgents': 23,
            'defaultValue': 1,
            'createdOn': '2023-04-03T08:47:03.066+00:00',
            'supervisors': [{name: 'Poul Reeds'}, {name: 'Maggie Jons'}, {name: 'john Hamilton'}],
        }, {
            'id': '6540acdaa9138a594ke99790',
            'name': 'Business Management',
            'availableAgents': 14,
            'defaultValue': 1,
            'createdOn': '2023-05-03T08:47:03.066+00:00',
            'supervisors': [{name: 'Michal Hanery'}, {name: 'ashley graham'}],
        },

    ];
    availabeAgentsLis = [
        {
            'id': '6540ac42kk',
            'userName': 'john-hamilton',
            'firstName': 'john ',
            'lastName': 'Hamilton',
            isSelected:false

        }, {
            'id': '42kke99790',
            'userName': 'andrewT9',
            'firstName': 'Andrew ',
            'lastName': 'Trate',
            isSelected:false

        }, {
            'id': '138a594244e9',
            'userName': 'mhanery98',
            'firstName': 'Michal ',
            'lastName': 'Hanery',
            isSelected:false

        }, {
            'id': '65138a5942',
            'userName': 'g_ashley',
            'firstName': 'ashley ',
            'lastName': 'graham',
            isSelected:false

        }, {
            'id': '54138a5942',
            'userName': 'a_miller54',
            'firstName': 'Adam ',
            'lastName': 'Miller',
            isSelected:false

        }, {
            'id': '6540ac4299',
            'userName': 'h_andy541',
            'firstName': 'Hamilton ',
            'lastName': 'Andu',
            isSelected:false

        }, {
            'id': '4758e99790',
            'userName': 'j_trate55',
            'firstName': 'Json ',
            'lastName': 'Trate',
            isSelected:false

        }, {
            'id': '588a594244e9',
            'userName': 'ncawsy5',
            'firstName': 'Norton ',
            'lastName': 'Cawsy',
            isSelected:false

        },
    ];
    supervisors: Supervisor[] = [
        {value: 'ammamaria', viewValue: 'Ammamaria'},
        {value: 'simon', viewValue: 'Simon Lee'},
        {value: 'cairistiona', viewValue: 'Cairistiona'},
    ];
    secondarySupervisorInTeam = [
        {'assignAgents': 21, 'secondarySupervisor': 'Jason Wright'},
        {'assignAgents': 19, 'secondarySupervisor': 'Jason Reeds'},
        {'assignAgents': 33, 'secondarySupervisor': 'Maggie Jones'},
        {'assignAgents': 12, 'secondarySupervisor': 'Adam Miller'},
    ];
    masterSelected:boolean;
    checkedList:any;


    SelectedSecondarySupervisorInTeam = 'Jason Wright';
    selected = 'ammamaria';
    constructor(
        private commonService: CommonService,
        private dialog: MatDialog,
    ) {
        this.masterSelected = false;

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
            {"id":3,"supervisor":"Carmencita"},
        ];
        this.secondarySupervisor = [
            {"id":4,"supervisor": "Jacqueminot Ruthen"},
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
                width: '500px',
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


    onItemSelect(item: any) {
        console.log(item);
        console.log(this.selectedAgent);
    }

    OnItemDeSelect(item: any) {
        console.log(item);
        console.log(this.selectedAgent);
    }

    onSelectAll(items: any) {
        console.log(items);
    }

    onDeSelectAll(items: any) {
        console.log(items);
    }


    assignUnassignAgents(templateRef, data) {

        let dialogRef = this.dialog.open(templateRef, {
            width: "100%",
            maxWidth: "1200px",
            panelClass: ["add-attribute", "assign-unassign-agents"],
            disableClose: true,
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {
        });

        }

    selectedSecondary(e) {
        this.SelectedSecondarySupervisorInTeam = e;

    }



    checkUncheckAll() {
        for (var i = 0; i < this.availabeAgentsLis.length; i++) {
            this.availabeAgentsLis[i].isSelected = this.masterSelected;
        }
        this.getCheckedItemList();
    }
    isAllSelected() {
        this.masterSelected = this.availabeAgentsLis.every(function(item:any) {
            return item.isSelected == true;
        })
        this.getCheckedItemList();
    }

    getCheckedItemList(){
        this.checkedList = [];
        for (var i = 0; i < this.availabeAgentsLis.length; i++) {
            if(this.availabeAgentsLis[i].isSelected)
                this.checkedList.push(this.availabeAgentsLis[i]);
        }
        this.checkedList = JSON.stringify(this.checkedList);
    }


    }
