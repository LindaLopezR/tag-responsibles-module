import { Template } from 'meteor/templating';
import EditResponsible from './EditResponsible.jsx';

import './editResponsible.html';

Template.editResponsible.helpers({

    EditResponsible() {
        return EditResponsible;
    }
});
