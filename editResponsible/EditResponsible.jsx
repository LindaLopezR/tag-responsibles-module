import React from 'react';
import { TAPi18n } from 'meteor/tap:i18n';
import { Router } from 'meteor/iron:router';
import { withTracker } from 'meteor/react-meteor-data';
import { orderFunction } from 'meteor/igoandsee:order-lists-module';

import { Locations } from 'meteor/igoandsee:locations-collection';
import { TagCategories } from 'meteor/igoandsee:tag-categories-collection';
import { Responsibles } from 'meteor/igoandtag:responsibles-collection';

class EditResponsible extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            category: '',
            location: '',
            user: '',
            users: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { responsible, loading, users } = nextProps;
        const state = {
            loading: loading
        };

        console.log(responsible)

        if (responsible) {
            state.category = responsible.category;
            state.location = responsible.location;
            state.user = responsible.user;
            state.users = users.map( user => user._id );
        }

        this.setState(state);
    }

    handleChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    renderDropdown(data) {
        return data.map((item) => {
            return (
                <option key={item._id} value={item._id}>
                    {item.name}
                </option>
            );
        });
    }

    renderLoading() {
        return (
            <div className="ui active dimmer">
                <div className="ui text loader">{TAPi18n.__("loading")}</div>
            </div>
        );
    }

    handleCancel(e) {
        e.preventDefault();
        Router.go("tagResponsible");
    }

    handleSubmit(e) {
        e.preventDefault();
        const { category, location, user } = this.state;
        const data = {
            _id: this.props.responsible._id,
            category,
            location,
            user
        }

        if (!data.category) {
            Session.set('ERROR_MESSAGE', TAPi18n.__("enter_category"));
            $('#modalError').modal('show');
            return;
        }

        if (!data.location) {
            Session.set('ERROR_MESSAGE', TAPi18n.__("select_a_location"));
            $('#modalError').modal('show');
            return;
        }

        if (!data.user) {
            Session.set('ERROR_MESSAGE', TAPi18n.__("enter_user"));
            $('#modalError').modal('show');
            return;
        }

        this.setState({ loading: true });

        Meteor.call('editResponsible', data, (error, response) => {
            this.setState({ loading: false});
            if (error) {
                Session.set('ERROR_MESSAGE', TAPi18n.__("error_editing_responsible"));
                $('#modalError').modal('show');
            }

            if (response) {
                Session.set('SUCCESS_MESSAGE', TAPi18n.__("responsible_successfully_edited"));
                $('#modalSuccess').modal('show');
                Router.go("tagResponsible");
            }
        })
    }
    
    render() {
        const { category, loading, location, user, users } = this.state;
        console.log(this.state);
        return (
            <div className="container">
                {loading ? this.renderLoading() : null}
                <div className="row mgt-1">
                    <div className="col-md-12 box-width-12">
                        <div className="pannell">
                            <div className="cabeza-panel-azul">
                                <h3>
                                    <i className="bookmark icon" /> {TAPi18n.__("edit_responsible")}
                                </h3>
                            </div>
                            <div className="cuerpo-panel-azul">
                                <div className="row">
                                    <form className="ui form" id="formTagResponsible" onSubmit={this.handleSubmit.bind(this)}>
                                        <div className="col-md-1"><p>&nbsp;</p></div>
                                        <div className="col-md-10">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="field">
                                                        <label>{TAPi18n.__("user")}</label>
                                                        <select
                                                            className="ui dropdown"
                                                            name="user"
                                                            value={user}
                                                            onChange={(e) => this.handleChange(e)}
                                                            id="user"
                                                        >
                                                            <option value="">{TAPi18n.__("select")}</option>
                                                            {
                                                                users.map( item => {
                                                                    const user = Meteor.users.findOne(item);
                                                                    const username = `${user.profile.name} ${user.profile.lastName}`;
                                                                    return (
                                                                        <option value={user._id} key={user._id} className="tareaStyle">
                                                                            {username}
                                                                        </option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 mgt-1">
                                                    <div className="field">
                                                        <label> {TAPi18n.__('category')} </label>
                                                        <select
                                                            className="ui dropdown"
                                                            name="category"
                                                            value={category}
                                                            onChange={(e) => this.handleChange(e)}
                                                            id="category"
                                                        >
                                                            <option value="">{TAPi18n.__("select")}</option>
                                                            {this.renderDropdown(this.props.categories)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 mgt-1">
                                                    <div className="field">
                                                        <label> {TAPi18n.__('location')} </label>
                                                        <select
                                                            className="ui dropdown"
                                                            name="location"
                                                            value={location}
                                                            onChange={(e) => this.handleChange(e)}
                                                            id="location"
                                                        >
                                                            <option value="">{TAPi18n.__("select")}</option>
                                                            {this.renderDropdown(this.props.locations)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="linea-azul" />
                                            <div className="row">
                                                <div className="col-xs-12 text-right">
                                                    <button className="ui button btnsave" type="submit">
                                                        {TAPi18n.__("save")}
                                                    </button>
                                                    <button className="ui button" id="btnCancelLocation" onClick={this.handleCancel}>
                                                        {TAPi18n.__("cancel")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-1"><p>&nbsp;</p></div>
                                    </form>
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
        Meteor.subscribe('allLocations'),
        Meteor.subscribe('allTagCategories'),
        Meteor.subscribe('usersBySupervisor'),
    ];
    const loading = handles.some(handle => !handle.ready());
    console.log(Responsibles.find(responsibleId))
    return {
        categories: orderFunction(TagCategories.find().fetch()),
        locations: orderFunction(Locations.find().fetch()),
        users: Meteor.users.find({ 'profile.rol' : { $ne : 0 } }, {sort:{'profile.name':1}}).fetch(),
        responsible: Responsibles.findOne(responsibleId),
        loading
    };
})(EditResponsible);
