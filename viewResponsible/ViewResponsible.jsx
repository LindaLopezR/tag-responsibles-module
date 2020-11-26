import React from 'react';
import { TAPi18n } from 'meteor/tap:i18n';
import { Router } from 'meteor/iron:router';
import { withTracker } from 'meteor/react-meteor-data';

import { Locations } from 'meteor/igoandsee:locations-collection';
import { TagCategories } from 'meteor/igoandsee:tag-categories-collection';
import { Responsibles } from 'meteor/igoandtag:responsibles-collection';

function collectionItemName(collection, id) {
    const item = collection.findOne({ _id: id });
    if (!item) return '--';
    return item.name;
}

class ViewResponsible extends React.Component {

    constructor(props) {
        super(props);
    
            this.state = {
            responsible: null
        }
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            loading: nextProps.loading,
            responsible: nextProps.responsible
        })
    }

    renderLoading() {
        return (
            <div className="ui active dimmer">
                <div className="ui text loader">
                    {TAPi18n.__('loading')}
                </div>
            </div>
        )
    }
    
    render() {
        const { loading, responsible } = this.state;

        let username;
        let location;
        let category;

        if (responsible) {
            console.log(responsible);
            const user = Meteor.users.findOne(responsible.user);
            username = user ? `${user.profile.name} ${user.profile.lastName}` : '---';
            location = responsible.location;
            category = responsible.category;
        }
            

        if (loading) {
            return this.renderLoading();
        }

        return (
            <div className="container">
                <div className="row mgt-1">
                    <div className="col-xs-12">
                        <div className="pannell sectionLocation content-detail-rules">
                            <div className="cabeza-panel-azul">
                                <h3 className="titleViewLocation">
                                    <i className="bookmark icon" /> {TAPi18n.__("detail_responsible")}
                                </h3>
                            </div>

                            <div className="cuerpo-panel-azul view-location">
                                
                                <div className="row">
                                    <div className="col-md-1"><p>&nbsp;</p></div>
                                    <div className="col-md-10">
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <h3 className="titulo">{TAPi18n.__('user')}</h3>
                                                <p className="parrafo-view">{username}</p>
                                            </div>
                                            <div className="col-xs-6">
                                                <h3 className="titulo">{TAPi18n.__('location')}</h3>
                                                <p className="parrafo-view">
                                                    { collectionItemName(Locations, location) }
                                                </p>
                                            </div>
                                            <div className="col-xs-6">
                                                <h3 className="titulo">{TAPi18n.__('category')}</h3>
                                                <p className="parrafo-view">
                                                    { collectionItemName(TagCategories, category)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-1"><p>&nbsp;</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default withTracker(() => {
    const url = Router.current().originalUrl;
    const tokens = url.split('/');
    const responsibleId = tokens[ tokens.length -1 ];

    const handles = [
        Meteor.subscribe('tagResponsibleDetail', responsibleId),
        Meteor.subscribe('allTagCategories'),
        Meteor.subscribe('usersBySupervisor'),
        Meteor.subscribe('allResponsibles')
    ];

    const loading = handles.some(handle => !handle.ready());
    return {
        responsible: Responsibles.findOne(responsibleId),
        loading
    };
})(ViewResponsible);
