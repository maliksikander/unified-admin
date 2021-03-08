import { PipeTransform, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Pipe({
    name: 'getHealthStatus',
    pure: true
})
export class HealthStatusFilterPipe implements PipeTransform {

    constructor(private httpClient: HttpClient) { }

    transform(list: any,connector:any): any {
        // if (!list) {
        //   return list;
        // }
        console.log("item-->", list)
        console.log("connector-->", connector)
        // list.forEach((item) => {
        //     let url = item.channelWebhook;
        //     let test = "https://6b250c26-4270-4838-9987-df3383a76f23.mock.pstmn.io";


        //     this.httpClient.get(test + "/channel-connectors/health")
        //         .subscribe((res: any) => {
        //             console.log(item.id,"<--res->", res);
        //             item['status'] = res.status;
        //         })




        // });
        return list;

    }
}
