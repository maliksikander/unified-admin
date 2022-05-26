import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-mrd-tasks',
    templateUrl: './mrd-tasks.component.html',
    styleUrls: ['./mrd-tasks.component.scss']
})
export class MrdTasksComponent implements OnInit {
    p: any = 1;
    spinner: any = true;
    searchTerm = "";
    itemsPerPageList = [5, 10, 15];
    itemsPerPage = 5;
    selectedItem = this.itemsPerPageList[0];

    mrdTasksData = [{
        name: "Glenn Helgass",
        MrdTask: [{
            label: "voice call",
            maxValue: 5,
            defaultValue: 3
        },
            {
                label: "video call",
                maxValue: 5,
                defaultValue: 1
            },
            {
                label: "chat",
                maxValue: 5,
                defaultValue: 3
            },
            {
                label: "email",
                maxValue: 5,
                defaultValue: 5
            },
            {
                label: "Social media",
                maxValue: 5,
                defaultValue: 4
            }
        ]
    },
        {
            name: "Ev Gayforth",
            MrdTask: [{
                label: "voice call",
                maxValue: 5,
                defaultValue: 2
            },
                {
                    label: "video call",
                    maxValue: 5,
                    defaultValue: 1
                },
                {
                    label: "chat",
                    maxValue: 5,
                    defaultValue: 5
                },
                {
                    label: "email",
                    maxValue: 5,
                    defaultValue: 5
                },
                {
                    label: "Social media",
                    maxValue: 5,
                    defaultValue: 4
                }
            ]
        }, {
            name: "Verne West",
            MrdTask: [{
                label: "voice call",
                maxValue: 5,
                defaultValue: 3
            },
                {
                    label: "video call",
                    maxValue: 5,
                    defaultValue: 1
                },
                {
                    label: "chat",
                    maxValue: 5,
                    defaultValue: 3
                },
                {
                    label: "email",
                    maxValue: 5,
                    defaultValue: 5
                },
                {
                    label: "Social media",
                    maxValue: 5,
                    defaultValue: 5
                }
            ]
        },
      {
        name: "Glenn Helgass",
        MrdTask: [{
          label: "voice call",
          maxValue: 5,
          defaultValue: 3
        },
          {
            label: "video call",
            maxValue: 5,
            defaultValue: 1
          },
          {
            label: "chat",
            maxValue: 5,
            defaultValue: 3
          },
          {
            label: "email",
            maxValue: 5,
            defaultValue: 5
          },
          {
            label: "Social media",
            maxValue: 5,
            defaultValue: 4
          }
        ]
      },
      {
        name: "Ev Gayforth",
        MrdTask: [{
          label: "voice call",
          maxValue: 5,
          defaultValue: 2
        },
          {
            label: "video call",
            maxValue: 5,
            defaultValue: 1
          },
          {
            label: "chat",
            maxValue: 5,
            defaultValue: 5
          },
          {
            label: "email",
            maxValue: 5,
            defaultValue: 5
          },
          {
            label: "Social media",
            maxValue: 5,
            defaultValue: 4
          }
        ]
      }, {
        name: "Verne West",
        MrdTask: [{
          label: "voice call",
          maxValue: 5,
          defaultValue: 3
        },
          {
            label: "video call",
            maxValue: 5,
            defaultValue: 1
          },
          {
            label: "chat",
            maxValue: 5,
            defaultValue: 3
          },
          {
            label: "email",
            maxValue: 5,
            defaultValue: 5
          },
          {
            label: "Social media",
            maxValue: 5,
            defaultValue: 5
          }
        ]
      }
    ]


    constructor() {
    }

    ngOnInit(): void {
        console.log(this.mrdTasksData.length)
        let pageNumber = sessionStorage.getItem("currentAttributePage");
        if (pageNumber) this.p = pageNumber;
    }

    taskArray(n) {
        n = ++n;
        return new Array(n);
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

}
