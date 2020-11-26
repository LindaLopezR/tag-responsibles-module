import React from 'react';
import { TAPi18n } from 'meteor/tap:i18n';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';

import { Locations } from 'meteor/igoandsee:locations-collection';
import { TagCategories } from 'meteor/igoandsee:tag-categories-collection';
import { Responsibles } from 'meteor/igoandtag:responsibles-collection';

function collectionItemName(collection, id) {
    const item = collection.findOne({ _id: id });
    if (!item) return '--';
    return item.name;
}

class TagResponsible extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            loading: nextProps.loading
        });
    }

    getColumns() {
        return [
            {
                Header: TAPi18n.__('user'),
                accessor: 'user',
                Cell: props => {
                    const user = Meteor.users.findOne(props.value);
                    if (user) {
                        const username = `${user.profile.name} ${user.profile.lastName}`;
                        return (
                            <center>
                                <p>{username}</p>
                            </center>
                        );
                    } else {
                        return (<center>---</center>);
                    }
                }
            },
            {
                Header: TAPi18n.__('location'),
                accessor: 'location',
                Cell: props => (
                    <center>
                        <p>{ collectionItemName(Locations, props.value) }</p>
                    </center>
                )
            }, 
            {
                Header: TAPi18n.__('category'),
                accessor: 'category',
                Cell: props => (
                    <center>
                        <p>{ collectionItemName(TagCategories, props.value)}</p>
                    </center>
                )
            },
            {
                Header: TAPi18n.__('view'),
                accessor: '_id',
                Cell: props => (
                    <center>
                        <a href={"/tagResponsible/view/" + props.value } className="circular ui icon button teal tiny">
                            <i className="unhide icon"></i>
                        </a>
                    </center>
                )
            },
            {
                Header: TAPi18n.__('edit'),
                accessor: '_id',
                Cell: props => (
                    <center>
                        <a href={"/tagResponsible/edit/" + props.value } className="circular ui icon button blue tiny">
                            <i className="edit icon"></i>
                        </a>
                    </center>
                )
            },
            {
                Header: TAPi18n.__('delete'),
                accessor: '_id',
                Cell: props => (
                    <center>
                        <button className="circular ui icon button red tiny" onClick={ () => this.clickDelete(props.value) }>
                            <i className="remove icon"></i>
                        </button>
                    </center>
                )
            }
        ];
    }

    clickDelete(responsibleId) {
        $('#modalOptions').modal({
            closable  : false,
            onDeny() {
    
            },
            onApprove() {
                Meteor.call('deleteResponsible', responsibleId, (err, result) => {        
                    if(err){
                        Session.set('ERROR_MESSAGE', TAPi18n.__('error_deleting_responsible'));
                        $('#modalError').modal('show');
                    } else if (result) {
                        Session.set('SUCCESS_MESSAGE', TAPi18n.__('responsible_deleted'));
                        $('#modalSuccess').modal('show');
                    }
                });
            }
        }).modal('show');
    }

    renderLoading() {
        return (
            <div className="ui active dimmer">
                <div className="ui text loader">{TAPi18n.__('loading')}</div>
            </div>
        )
    }
    
    renderNoData() {
        return (
            <div className="no-gembas noData-tell">
                <i className="warning circle icon ui centered huge" />
                <p className="title-noData">{TAPi18n.__('no_data_display')}</p>
            </div>
        )
    }
    
    render() {
        const responsibles = this.props.responsibles.map((responsible, index) => {
            responsible.index = index + 1;
            return responsible;
        })

        const columns = this.getColumns();
        
        if (this.state.loading) {
            return this.renderLoading();
        }

        return (
            <div className="container">
                <div className="row mgt-1">
                    <div className="col-xs-6">
                        <h2>
                            <i className="bookmark icon" /> {TAPi18n.__("responsable")}
                        </h2>
                    </div>
                    <div className="col-xs-6 text-right">
                        <a href="/tagResponsible/new">
                            <button className="ui icon button teal" id="btnNew">
                                <i className="bookmark icon" /> {TAPi18n.__("new_responsible")}
                            </button>
                        </a> 
                    </div>
                </div>

                <div className="mgt-1">
                    {responsibles.length > 0 ? <ReactTable
                        data={responsibles}
                        columns={columns}
                        defaultPageSize={10}
                        className="-striped -highlight table-responsibles"
                    /> : this.renderNoData()}
                </div>
            
            </div>
        );
    }
};

export default withTracker(() => {
    const handles = [
        Meteor.subscribe('allLocations'),
        Meteor.subscribe('allTagCategories'),
        Meteor.subscribe('usersBySupervisor'),
        Meteor.subscribe('allResponsibles')
    ];

    const loading = handles.some(handle => !handle.ready());
    return {
        responsibles: Responsibles.find({}).fetch(),
        loading
    };
}) (TagResponsible);
