import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from '../services/common.service';
import {MatDialog} from '@angular/material/dialog';
import {EndpointService} from '../services/endpoint.service';
import {SnackbarService} from '../services/snackbar.service';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';

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
    searchTerm = '';
    count = 0;
    searchSecondary = '';
    loginForm: FormGroup;

    formErrors = {
        name: '',
        description: '',
        type: '',
    };
    validations;
    attributeForm: FormGroup;
    formHeading = 'Create Team';
    saveBtnText = 'Add';
    teamData = [
        {
            'id': '6540acdaa9138a5942kke99790',
            'name': 'Marketing',
            'availableAgents': 45,
            'defaultValue': 1,
            'createdOn': '2023-02-03T08:47:03.066+00:00',
            'supervisors': [{name: 'Jason Reeds'}],
            'secondarySupervisors': [{name: 'john Hamilton'}, {name: 'Maggie Jons'}, {name: 'Jason Reeds'}],
            'userName': 'mhanery98',
            'firstName': 'Michal ',
            'lastName': 'Hanery',
            'email': 'rfernandez3@elegantthemes.com',
            isSelected: false
        }, {
            'id': '6540acdaa91a5942kke99790',
            'name': 'Customer Support',
            'availableAgents': 36,
            'defaultValue': 1,
            'createdOn': '2023-04-03T08:47:03.066+00:00',
            'supervisors': [{name: 'Maggie Jons'}],
            'secondarySupervisors': [{name: 'Andrew Trate'}, {name: 'Michal Jons'}],
            'userName': 'g_ashley',
            'firstName': 'ashley ',
            'lastName': 'graham',
            'email': 'aclemits0@pagesperso-orange.fr',
            isSelected: false
        }, {
            'id': '6540acdaa9138a5942k99790',
            'name': 'Technical Support',
            'availableAgents': 23,
            'defaultValue': 1,
            'createdOn': '2023-04-03T08:47:03.066+00:00',
            'supervisors': [{name: 'Poul Reeds'}],
            'secondarySupervisors': [{name: 'Adam Reeds'}, {name: 'Maggie Jons'}, {name: 'john Hamilton'}],
            'userName': 'andrewT9',
            'firstName': 'Andrew ',
            'lastName': 'Trate',
            'email': 'bjays1@technorati.com',
            isSelected: false
        }, {
            'id': '6540acdaa9138a594ke99790',
            'name': 'Business Management',
            'availableAgents': 14,
            'defaultValue': 1,
            'createdOn': '2023-05-03T08:47:03.066+00:00',
            'supervisors': [{name: 'john Hamilton'}],
            'secondarySupervisors': [{name: 'Michal Hanery'}, {name: 'ashley graham'}],
            'userName': 'john-hamilton',
            'firstName': 'john ',
            'lastName': 'Hamilton',
            'email': 'aclemits0@pagesperso-orange.fr',
            isSelected: false
        },

    ];
    availabeAgentsLis = [
        {
            'id': '6540ac42kk',
            'userName': 'john-hamilton',
            'firstName': 'john ',
            'lastName': 'Hamilton',
            'email': 'aclemits0@pagesperso-orange.fr',
            isSelected: false

        }, {
            'id': '42kke99790',
            'userName': 'andrewT9',
            'firstName': 'Andrew ',
            'lastName': 'Trate',
            'email': 'bjays1@technorati.com',
            isSelected: false

        }, {
            'id': '138a594244e9',
            'userName': 'mhanery98',
            'firstName': 'Michal ',
            'lastName': 'Hanery',
            'email': 'rfernandez3@elegantthemes.com',
            isSelected: false

        }, {
            'id': '65138a5942',
            'userName': 'g_ashley',
            'firstName': 'ashley ',
            'lastName': 'graham',
            'email': 'aclemits0@pagesperso-orange.fr',
            isSelected: false

        }, {
            'id': '54138a5942',
            'userName': 'a_miller54',
            'firstName': 'Adam ',
            'lastName': 'Miller',
            'email': 'cnevin4@istockphoto.com',
            isSelected: false

        }, {
            'id': '6540ac4299',
            'userName': 'h_andy541',
            'firstName': 'Hamilton ',
            'lastName': 'Andu',
            'email': 'aclemits0@pagesperso-orange.fr',
            isSelected: false

        }, {
            'id': '4758e99790',
            'userName': 'j_trate55',
            'firstName': 'Json ',
            'lastName': 'Trate',
            'email': 'aclemis0@pagesperso-orange.fr',
            isSelected: false

        }, {
            'id': '588a594244e9',
            'userName': 'ncawsy5',
            'firstName': 'Norton ',
            'lastName': 'Cawsy',
            'email': 'aclemis0@pagesperso-orange.fr',
            isSelected: false

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
    masterSelected: boolean;
    checkedList: any;
    masterSelected2: boolean;
    checkedList2: any;


    SelectedSecondarySupervisorInTeam = 'Jason Wright';
    selected = 'ammamaria';

    constructor(
        private commonService: CommonService,
        private dialog: MatDialog,
    ) {
        this.masterSelected = false;
        this.masterSelected2 = false;

    }

    ngOnInit() {
        this.dropdownList = [
            {'id': 1, 'agentName': 'Ammamaria', 'agentUsername': 'ammamaria_001', 'supervisor': 'Ammamaria'},
            {'id': 2, 'agentName': 'Jason Reeds', 'agentUsername': 'jreeds52', 'supervisor': 'Jason Reeds'},
            {'id': 3, 'agentName': 'Maggie Jones', 'agentUsername': 'maggie_j', 'supervisor': 'Maggie Jones'},
            {'id': 4, 'agentName': 'Adam Miller', 'agentUsername': 'adam_miller', 'supervisor': 'Adam Miller'},
            {'id': 5, 'agentName': 'Andrew Trate', 'agentUsername': 'a_trate21', 'supervisor': 'Andrew Trate'},
            {'id': 6, 'agentName': 'Simon Lee', 'agentUsername': 'simon_lee87', 'supervisor': 'Simon Lee'},
            {'id': 7, 'agentName': 'John Doe', 'agentUsername': 'j_doe99', 'supervisor': 'John Doe'},
            {'id': 8, 'agentName': 'Jason Wright', 'agentUsername': 'jason_wright1', 'supervisor': 'Jason Wright'},
        ];
        this.selectedAgent = [
            {'id': 1, 'agentName': 'Ammamaria'},
            {'id': 2, 'agentName': 'Jason Reeds'},
        ];
        this.selectedSupervisor = [
            {'id': 3, 'supervisor': 'Carmencita'},
        ];
        this.secondarySupervisor = [
            {'id': 4, 'supervisor': 'Jacqueminot Ruthen'},
        ];
        this.dropdownSettings = {
            singleSelection: false,
            text: '',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: 'custom-class',
            badgeShowLimit: 3,
            searchPlaceholderText: 'Search'


        };
    }


    addTeam(templateRef) {
        this.formHeading = 'Add Team';
        let dialogRef = this.dialog.open(templateRef, {
            width: '550px',
            panelClass: ['add-attribute', 'add-team'],
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
            width: '550px',
            panelClass: ['add-attribute', 'add-team'],
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
                    heading: 'Delete Team',
                    message: msg,
                    text: 'confirm'
                },
            })
            .afterClosed()
            .subscribe((res: any) => {
            });
    }

    //save page number storage for reload
    pageChange(e) {
        sessionStorage.setItem('currentAttributePage', e);
    }

    //page bound change and saving for reload
    pageBoundChange(e) {
        this.p = e;
        sessionStorage.setItem('currentAttributePage', e);
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
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '100vh',
            panelClass: ['add-attribute', 'assign-unassign-agents'],
            disableClose: true,
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {
        });

    }

    selectedSecondary(e) {
        this.SelectedSecondarySupervisorInTeam = e;

    }


    checkUncheckAll(e) {
        if (e == 'unavail-agents') {

            for (var i = 0; i < this.availabeAgentsLis.length; i++) {
                this.availabeAgentsLis[i].isSelected = this.masterSelected;
            }
            this.getCheckedItemList(e);
        }
        else {

            for (var i = 0; i < this.teamData.length; i++) {
                this.teamData[i].isSelected = this.masterSelected2;
            }
            this.getCheckedItemList('avail-agents');
        }
    }

    isAllSelected(e) {
        if (e == 'unavail-agents') {
            this.masterSelected = this.availabeAgentsLis.every(function(item: any) {
                return item.isSelected == true;
            });
            this.getCheckedItemList(e);
        }else {
            this.masterSelected2 = this.teamData.every(function(item: any) {
                return item.isSelected == true;
            });
            this.getCheckedItemList('avail-agents');
        }
    }

    getCheckedItemList(e) {
        this.checkedList = [];
        this.checkedList2 = [];
        if (e == 'unavail-agents') {
            for (var i = 0; i < this.availabeAgentsLis.length; i++) {
                if (this.availabeAgentsLis[i].isSelected) {
                    this.checkedList.push(this.availabeAgentsLis[i]);
                }
            }
            this.checkedList = JSON.stringify(this.checkedList);
        }
        else {
            for (var i = 0; i < this.teamData.length; i++) {
                if (this.teamData[i].isSelected) {
                    this.checkedList2.push(this.teamData[i]);
                }
            }
            this.checkedList2 = JSON.stringify(this.checkedList2);
        }
    }

    agentLists(templateRef) {
        let dialogRef = this.dialog.open(templateRef, {
            width: '80vw',
            maxWidth: '600px',
            panelClass: ['add-attribute', 'agents-list-dialog'],
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
        });
    }


}