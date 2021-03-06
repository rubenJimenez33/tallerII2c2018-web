import React from "react";
import ServerRow from "./Server-row";
import Axios from "axios";
import ApiLinks from "../../utils/ApiLinks";
import Auth from "../../utils/auth";

class serverList extends React.Component {
    constructor(props) {
        super(props)
        this.state = { servers: "",
            responseError: false 
        };
    }

    componentWillMount() {
        this.setState({responseError: false});
        var config = {
            headers: { 'Authorization':Auth.getToken() }
        };

        let currentComponent = this;

        Axios
            .get(ApiLinks.Servers, config)
            .then(function (response) {
                currentComponent.setState({servers: response.data});
                if(response.data.length === 0)
                    currentComponent.setState({responseError: true});
            })
            .catch(function (error) {
                console.log(error);
                currentComponent.setState({responseError: true});                
            });
    }

    render() {

        if (this.state.responseError) {
            return <p className="text-center">Not Results</p>
        
        }else if (this.state.servers !== "") {
            var data = this.state.servers;
            return (
                <ul>
                    <form className="metadataServers">
                        <p> total: {data.metadata.total}</p>
                        <p> version: {data.metadata.version}</p>
                    </form>
                    <p/>
                    <form>
                        {
                            data.server.map((server,i) => {
                                return<ServerRow key={i}
                                        id={server.id}
                                        _rev={server._rev}
                                        createdBy={server.createdBy}
                                        createdTime={server.createdTime}
                                        name={server.name}
                                        lastConnection={server.lastConnection}>
                                    </ServerRow>
                            })
                        }
                    </form>
                </ul>
            );

        } else {
            return <p className="text-center">Loading...</p>
        }
    }
}

export default serverList;