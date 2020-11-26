import { Template } from 'meteor/templating';
import TagResponsible from './TagResponsible.jsx';

import './tagResponsible.html';

Template.tagResponsible.helpers({

    TagResponsible() {
        return TagResponsible;
    }
});
