import { Template } from 'meteor/templating';
import ViewResponsible from './ViewResponsible.jsx';

import './viewResponsible.html';

Template.viewResponsible.helpers({

    ViewResponsible() {
        return ViewResponsible;
    }
});
