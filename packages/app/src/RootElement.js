import {
    LitElement,
    html
} from "lit-element";
import resetCSS from '../styles/reset.js';
import rootSyles from '../styles/RootElement.styles';
import '../../companies/app-companies';

export class RootElement extends LitElement {

    static get styles() {
        return [
            resetCSS,
			rootSyles
        ]
    }

    render() {
        return html `
<app-companies></app-companies>
        `
    }
}
