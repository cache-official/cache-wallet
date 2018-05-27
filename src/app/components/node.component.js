import nem from "nem-sdk";

class NodeCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(DataStore, DataBridge, Nodes, Wallet) {
        'ngInject';

        //// Component dependencies region ////
        
        this._DataStore = DataStore;
        this._Wallet = Wallet;
        this._Nodes = Nodes;
        this._DataBridge = DataBridge;

        //// End dependencies region ////

        //// Component properties region ////

        /**
         * Store the selected node
         *
         * @type {object|undefined}
         */
        this.selectedNode = undefined;

        /**
         * Store the custom node
         *
         * @type {string|undefined}
         */
        this.customNode = undefined;

        //// End properties region ////

    }

    //// Component methods region ////

    /**
     * Change node and store it in local storage
     *
     * @param {string} node - A node ip
     * @param {number} port - A port number (optional)
     */
    changeNode(node, port) {
        if (!node) return;
        // Use the node service to clean input and return endpoint object
        let endpoint = this._Nodes.cleanEndpoint(node, port);
        // Update wallet service and local storage
        this._Nodes.update(endpoint);
        // Disconnect and connect to node
        this.reconnect(endpoint);
        // Reset node input and select
        this.customNode = undefined;
        this.selectedNode = undefined;
        return;
    }

    /**
     * Disconnect and connect to specified node
     *
     * @param {object} endpoint - An endpoint object
     */
    reconnect(endpoint) {
        // Close connector
        this._DataBridge.connector.close();
        // Set connection status to false
        this._DataStore.connection.status = false;
        // Reset data in DataBridge service
        this._DataBridge.reset();
                
        // Change endpoint port to websocket port
        let endpointWs = nem.model.objects.create("endpoint")(endpoint.host, nem.model.nodes.websocketPort);
        // Create a connector
        let connector = nem.com.websockets.connector.create(endpointWs, this._Wallet.currentAccount.address);
        // Open the connection with the connector
        this._DataBridge.openConnection(connector);
        return;
    }

    //// End methods region ////

}

// Node config
let Node = {
    controller: NodeCtrl,
    templateUrl: 'layout/partials/node.html'
};

export default Node;