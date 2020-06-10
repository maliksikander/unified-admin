import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material";

@Injectable()
export class SnackbarService {
    constructor(private snackbar: MatSnackBar) {
    }

    snackbarMessage(panelClass: string , message: string , duration: number ) {
        const config: MatSnackBarConfig = new MatSnackBarConfig();
        config.duration = duration * 3000;
        config.panelClass = [panelClass];
        // config.verticalPosition='top';

        this.snackbar.open(message, '', config);
    }

}
