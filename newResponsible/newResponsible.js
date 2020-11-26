import { Template } from 'meteor/templating';
import NewResponsible from './NewResponsible.jsx';

import './newResponsible.html';

Template.newResponsible.helpers({

    NewResponsible() {
        return NewResponsible;
    }
});
