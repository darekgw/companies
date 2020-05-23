import {
    LitElement,
    html,
    css,
    property,
    TemplateResult
} from "lit-element";
import resetCSS from '../styles/reset.js';
import '../../companies/app-companies';

export class RootElement extends LitElement {

    static get styles() {
        return [
            resetCSS
        ]
    }

    render() {
        return html `
<app-companies></app-companies>
        `
    }
}
