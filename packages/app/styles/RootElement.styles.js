import {
	css
} from 'lit-element';

export default css `
*, *:before, *:after {
    font-family: Arial, Helvetica, sans-serif;
}

:host {
	--mobile-font-size: 16px;
	--desktop-font-size: 18px;
	--mobile-space: 8px;
	--tablet-space: 16px;
	--desktop-space: 32px;
}
`
